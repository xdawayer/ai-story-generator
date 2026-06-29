import { z } from "zod";
import { createStreamRoute } from "@/lib/api-stream-route";
import { buildStoryPrompt } from "@/lib/story-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const InputSchema = z.object({
  idea: z.string().max(600).optional().default(""),
  genre: z.string().max(40).optional().default(""),
  tone: z.string().max(40).optional().default(""),
  length: z.string().max(20).optional().default("Short"),
  pov: z.string().max(30).optional().default(""),
  // Present only for "Continue" — the story so far, extended by the next beat.
  continueFrom: z.string().max(8000).optional().default(""),
});

export const POST = createStreamRoute({
  schema: InputSchema,
  // Guests get a bounded short story; longer/structured output is a later paid path.
  maxOutputTokens: 1500,
  buildPrompt: buildStoryPrompt,
});
