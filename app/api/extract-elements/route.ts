// Structured "story elements" extraction — a second, non-streaming pass over a
// finished story that returns table-ready JSON (characters, locations, conflicts,
// secrets, plot hooks, open questions). Kept separate from the streaming
// generate-story route so the prose still streams; the result panel calls this
// once the story is done to populate its "Story elements" card. Same guest gates
// as the streaming routes (content-type, per-IP rate limit, validation, provider).
import { NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/ratelimit";
import { isLlmConfigured, completion } from "@/lib/llm";
import {
  buildStoryElementsPrompt,
  parseStoryElements,
} from "@/lib/story-elements-prompt";

export const runtime = "nodejs";
export const maxDuration = 30;

const InputSchema = z.object({ story: z.string().min(1).max(8000) });

function getIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest): Promise<Response> {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return Response.json(
      { error: "Expected application/json" },
      { status: 415 },
    );
  }

  // Namespaced key so this secondary pass keeps its own bucket and doesn't eat
  // the guest's generation quota. It only fires once per finished story, so its
  // rate is naturally bounded by the generation limit — no extra abuse surface.
  const rl = await rateLimit(`elements:${getIp(req)}`, {
    limit: 8,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    return Response.json(
      { error: "Free limit reached — try again in a minute." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

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

  if (!isLlmConfigured()) {
    return Response.json({ error: "Server not configured" }, { status: 503 });
  }

  const { system, user } = buildStoryElementsPrompt(parsed.data.story);
  try {
    const raw = await completion({ system, prompt: user, maxTokens: 700 });
    const elements = parseStoryElements(raw);
    if (!elements) {
      return Response.json(
        { error: "Could not parse story elements" },
        { status: 502 },
      );
    }
    return Response.json(
      { elements },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Extraction failed" }, { status: 502 });
  }
}
