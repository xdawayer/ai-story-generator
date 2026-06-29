import { z } from "zod";
import { createStreamRoute } from "@/lib/api-stream-route";
import { buildSettlementPrompt } from "@/lib/settlement-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const InputSchema = z.object({
  kind: z.string().max(40).optional().default(""),
  setting: z.string().max(40).optional().default(""),
  vibe: z.string().max(40).optional().default(""),
  detail: z.string().max(200).optional().default(""),
});

export const POST = createStreamRoute({
  schema: InputSchema,
  maxOutputTokens: 900,
  buildPrompt: buildSettlementPrompt,
});
