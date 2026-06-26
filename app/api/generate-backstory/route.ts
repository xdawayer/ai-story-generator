import { z } from "zod";
import { createStreamRoute } from "@/lib/api-stream-route";
import { buildBackstoryPrompt } from "@/lib/backstory-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const InputSchema = z.object({
  race: z.string().max(40).optional().default(""),
  charClass: z.string().max(60).optional().default(""),
  kind: z.string().max(40).optional().default(""),
  alignment: z.string().max(40).optional().default(""),
  tone: z.string().max(40).optional().default(""),
  detail: z.string().max(400).optional().default(""),
});

export const POST = createStreamRoute({
  schema: InputSchema,
  maxOutputTokens: 1100,
  buildPrompt: buildBackstoryPrompt,
});
