import { NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/ratelimit";
import { buildNpcPrompt } from "@/lib/npc-prompt";
import { isLlmConfigured, streamCompletion } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60;

// Hard output cap for unauthenticated guests — bounds cost + abuse blast radius.
const MAX_OUTPUT_TOKENS = 1200;

const InputSchema = z.object({
  race: z.string().max(40).optional().default(""),
  role: z.string().max(60).optional().default(""),
  alignment: z.string().max(40).optional().default(""),
  tone: z.string().max(40).optional().default(""),
  detail: z.string().max(400).optional().default(""),
  // Wedge hook: optional campaign context the NPC should fit.
  campaign: z.string().max(2000).optional().default(""),
});

function getIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  // Gate 1: content type
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Expected application/json" }, { status: 415 });
  }

  // Gate 2: per-IP rate limit BEFORE any model call (review non-negotiable).
  const rl = rateLimit(getIp(req), { limit: 8, windowMs: 60_000 });
  if (!rl.ok) {
    return Response.json(
      { error: "Free limit reached — sign up for more, or try again in a minute." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  // Gate 3: input validation (caps every field length).
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  // Gate 4: provider configured.
  if (!isLlmConfigured()) {
    return Response.json(
      { error: "Server not configured: set AZURE_OPENAI_* in .env.local (copy from gengrowth-agents)." },
      { status: 503 },
    );
  }

  const { system, user } = buildNpcPrompt(parsed.data);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of streamCompletion({
          system,
          prompt: user,
          maxTokens: MAX_OUTPUT_TOKENS,
        })) {
          controller.enqueue(encoder.encode(delta));
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n[generation error — please retry]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
