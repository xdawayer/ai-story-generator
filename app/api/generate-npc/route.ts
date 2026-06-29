import { z } from "zod";
import { createStreamRoute } from "@/lib/api-stream-route";
import { buildNpcPrompt } from "@/lib/npc-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const InputSchema = z.object({
  race: z.string().max(40).optional().default(""),
  role: z.string().max(60).optional().default(""),
  alignment: z.string().max(40).optional().default(""),
  tone: z.string().max(40).optional().default(""),
  detail: z.string().max(400).optional().default(""),
  // Wedge hook: optional campaign world note the NPC should fit (matches the
  // 4000-char world_note cap).
  campaign: z.string().max(4000).optional().default(""),
});

export const POST = createStreamRoute({
  schema: InputSchema,
  maxOutputTokens: 1200,
  buildPrompt: buildNpcPrompt,
});
