// Prompt builder for the Campaign Plot generator (the deepest free tool — turns
// a one-line idea into a runnable multi-act campaign skeleton). Higher-intent
// than the name/hook tools, so it funnels hard into the saved campaign workspace.
export interface CampaignPlotInput {
  idea: string; // optional seed premise
  setting: string; // fantasy / sci-fi / horror / etc.
  tone: string; // heroic / grim / political / etc.
  arcs: string; // rough number of acts/arcs
  detail: string;
}

const SYSTEM = [
  "You are a veteran tabletop RPG Game Master designing a campaign skeleton a GM can actually run.",
  "Output GitHub-flavored Markdown with these sections, in order, using ## headings:",
  "## Premise — 2-3 sentences setting up the world and the central conflict.",
  "## The Villain — name, goal, and why they're a credible threat (1 short paragraph).",
  "## Act I, ## Act II, ## Act III — for each act, a one-line goal then 2-3 bullet beats the party encounters.",
  "## The Twist — one genuine mid-campaign reversal that recontextualizes the conflict.",
  "## Climax — the final confrontation and what's at stake.",
  "## Hooks to Pull On — 3 bullets of loose threads the GM can develop further.",
  "",
  "Keep it concrete and playable, not generic. Original content only. Mature themes are fine; never produce real-world harmful content or any sexual content involving minors. Output ONLY the structured outline, no preamble.",
].join("\n");

export function buildCampaignPlotPrompt(i: CampaignPlotInput): {
  system: string;
  user: string;
} {
  const arcLine = i.arcs ? `Aim for roughly ${i.arcs} acts.` : "";
  const fields = [
    i.idea && `Seed idea: ${i.idea}`,
    i.setting && `Setting/genre: ${i.setting}`,
    i.tone && `Tone: ${i.tone}`,
    i.detail && `Extra guidance: ${i.detail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Design a campaign plot skeleton matching:\n${fields}\n${arcLine}`.trim()
    : `Design an original fantasy campaign plot skeleton for a tabletop RPG party. ${arcLine}`.trim();

  return { system: SYSTEM, user };
}
