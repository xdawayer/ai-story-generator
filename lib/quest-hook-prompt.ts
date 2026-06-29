// Prompt builder for the Quest Hook generator (acquisition tool — GMs search
// "quest hook generator" / "d&d quest ideas" constantly). Returns a batch of
// ready-to-run hooks, one per line, so a GM can grab one and improvise a session.
export interface QuestHookInput {
  setting: string; // fantasy / sci-fi / urban / etc.
  kind: string; // combat / intrigue / mystery / exploration / rescue
  tone: string; // heroic / grim / comedic / mysterious
  level: string; // low / mid / high — rough party power
  detail: string;
}

const SYSTEM = [
  "You are a tabletop RPG Game Master assistant. Generate a batch of quest hooks.",
  "Output GitHub-flavored Markdown: exactly 8 entries as a numbered list, one per line, formatted:",
  "1. **<Evocative quest title>** — <1-2 sentence hook: the inciting situation, the stakes, and a complication or twist a GM can run with>",
  "Each hook should be distinct in shape (not all 'go kill the monster') and genuinely playable.",
  "",
  "Rules: original content only. Mature themes are fine; never produce real-world harmful content or any sexual content involving minors. Output ONLY the numbered list, no preamble or closing text.",
].join("\n");

export function buildQuestHookPrompt(i: QuestHookInput): {
  system: string;
  user: string;
} {
  const fields = [
    i.setting && `Setting/genre: ${i.setting}`,
    i.kind && `Quest type: ${i.kind}`,
    i.tone && `Tone: ${i.tone}`,
    i.level && `Party power level: ${i.level}`,
    i.detail && `Extra guidance: ${i.detail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Generate 8 quest hooks matching:\n${fields}`
    : "Generate 8 varied fantasy quest hooks suitable for any tabletop RPG party.";

  return { system: SYSTEM, user };
}
