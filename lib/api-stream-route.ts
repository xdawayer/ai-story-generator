// Shared POST handler factory for the streaming free tools.
// Every tool route is identical except for its zod schema, prompt builder, and
// output cap — so the four abuse gates (content-type, per-IP rate limit BEFORE
// any model call, input validation, provider-configured) live here once.
import { NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit, type RateLimitOptions } from "@/lib/ratelimit";
import { isLlmConfigured, streamCompletion } from "@/lib/llm";

// Default guest gate: bound spend before the model call. Per-IP, per minute.
const DEFAULT_RATE_LIMIT: RateLimitOptions = { limit: 8, windowMs: 60_000 };

export interface StreamRouteConfig<T extends z.ZodTypeAny> {
  schema: T;
  // Hard output cap for unauthenticated guests — bounds cost + abuse blast radius.
  maxOutputTokens: number;
  buildPrompt: (data: z.infer<T>) => { system: string; user: string };
  rateLimit?: RateLimitOptions;
}

function getIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function createStreamRoute<T extends z.ZodTypeAny>(
  cfg: StreamRouteConfig<T>,
) {
  return async function POST(req: NextRequest): Promise<Response> {
    // Gate 1: content type
    if (!req.headers.get("content-type")?.includes("application/json")) {
      return Response.json(
        { error: "Expected application/json" },
        { status: 415 },
      );
    }

    // Gate 2: per-IP rate limit BEFORE any model call (review non-negotiable).
    const rl = await rateLimit(getIp(req), cfg.rateLimit ?? DEFAULT_RATE_LIMIT);
    if (!rl.ok) {
      return Response.json(
        {
          error:
            "Free limit reached — sign up for more, or try again in a minute.",
        },
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
    const parsed = cfg.schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // Gate 4: provider configured.
    if (!isLlmConfigured()) {
      return Response.json(
        {
          error:
            "Server not configured: set AZURE_OPENAI_* in .env.local (copy from gengrowth-agents).",
        },
        { status: 503 },
      );
    }

    const { system, user } = cfg.buildPrompt(parsed.data);
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const delta of streamCompletion({
            system,
            prompt: user,
            maxTokens: cfg.maxOutputTokens,
          })) {
            controller.enqueue(encoder.encode(delta));
          }
        } catch {
          controller.enqueue(
            encoder.encode("\n\n[generation error — please retry]"),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  };
}
