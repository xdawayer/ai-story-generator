import { z } from "zod";
import { createStreamRoute } from "@/lib/api-stream-route";
import { buildTavernPrompt } from "@/lib/tavern-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const InputSchema = z.object({
  vibe: z.string().max(40).optional().default(""),
  kind: z.string().max(40).optional().default(""),
  region: z.string().max(60).optional().default(""),
  detail: z.string().max(200).optional().default(""),
});

export const POST = createStreamRoute({
  schema: InputSchema,
  maxOutputTokens: 600,
  buildPrompt: buildTavernPrompt,
});
