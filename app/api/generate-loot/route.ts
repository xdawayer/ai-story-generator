import { z } from "zod";
import { createStreamRoute } from "@/lib/api-stream-route";
import { buildLootPrompt } from "@/lib/loot-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const InputSchema = z.object({
  tier: z.string().max(40).optional().default(""),
  setting: z.string().max(40).optional().default(""),
  theme: z.string().max(40).optional().default(""),
  level: z.string().max(40).optional().default(""),
  detail: z.string().max(200).optional().default(""),
});

export const POST = createStreamRoute({
  schema: InputSchema,
  maxOutputTokens: 700,
  buildPrompt: buildLootPrompt,
});
