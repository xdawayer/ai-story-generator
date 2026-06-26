import { z } from "zod";
import { createStreamRoute } from "@/lib/api-stream-route";
import { buildNamePrompt } from "@/lib/name-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const InputSchema = z.object({
  race: z.string().max(40).optional().default(""),
  gender: z.string().max(20).optional().default(""),
  style: z.string().max(60).optional().default(""),
  detail: z.string().max(200).optional().default(""),
});

export const POST = createStreamRoute({
  schema: InputSchema,
  maxOutputTokens: 600,
  buildPrompt: buildNamePrompt,
});
