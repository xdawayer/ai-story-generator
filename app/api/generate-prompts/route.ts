import { z } from "zod";
import { createStreamRoute } from "@/lib/api-stream-route";
import { buildWritingPromptsPrompt } from "@/lib/writing-prompts-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const InputSchema = z.object({
  genre: z.string().max(40).optional().default(""),
  tone: z.string().max(40).optional().default(""),
  audience: z.string().max(40).optional().default(""),
  kind: z.string().max(40).optional().default(""),
  detail: z.string().max(200).optional().default(""),
});

export const POST = createStreamRoute({
  schema: InputSchema,
  maxOutputTokens: 600,
  buildPrompt: buildWritingPromptsPrompt,
});
