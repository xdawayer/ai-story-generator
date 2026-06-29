// Prompt builder for the Random Encounter generator (a batch tool like quest
// hooks). Returns ready-to-run encounters — combat, social, and environmental —
// so a GM can drop one into a scene mid-session. Targets "random encounter
// generator" / "d&d encounter generator" search intent.
export interface EncounterInput {
  setting: string; // fantasy / sci-fi / horror / etc.
  environment: string; // forest / dungeon / city / road / coast / etc.
  kind: string; // combat / social / environmental / mixed
  level: string; // low / mid / high — rough party power
  detail: string;
}

const SYSTEM = [
  "You are a tabletop RPG Game Master assistant. Generate a batch of random encounters.",
  "Output GitHub-flavored Markdown: exactly 6 entries as a numbered list, one per line, formatted:",
  "N. **<evocative encounter title>** — <1-2 sentences: what the party meets, the situation, and a complication or twist a GM can run with>",
  "Vary the encounter types (not all combat) — mix fights, social/roleplay moments, hazards, and discoveries. Make each genuinely playable.",
  "",
  "Rules: original content only. Mature themes are fine; never produce real-world harmful content or any sexual content involving minors. Output ONLY the numbered list, no preamble or closing text.",
].join("\n");

export function buildEncounterPrompt(i: EncounterInput): {
  system: string;
  user: string;
} {
  const fields = [
    i.setting && `Setting/genre: ${i.setting}`,
    i.environment && `Environment: ${i.environment}`,
    i.kind && `Encounter type: ${i.kind}`,
    i.level && `Party power level: ${i.level}`,
    i.detail && `Extra guidance: ${i.detail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Generate 6 random encounters matching:\n${fields}`
    : "Generate 6 varied fantasy random encounters suitable for any tabletop RPG party.";

  return { system: SYSTEM, user };
}
