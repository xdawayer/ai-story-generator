import { z } from "zod";
import { createStreamRoute } from "@/lib/api-stream-route";
import { buildCampaignPlotPrompt } from "@/lib/campaign-plot-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const InputSchema = z.object({
  idea: z.string().max(400).optional().default(""),
  setting: z.string().max(40).optional().default(""),
  tone: z.string().max(40).optional().default(""),
  arcs: z.string().max(10).optional().default(""),
  detail: z.string().max(200).optional().default(""),
});

export const POST = createStreamRoute({
  schema: InputSchema,
  maxOutputTokens: 1100,
  buildPrompt: buildCampaignPlotPrompt,
});
