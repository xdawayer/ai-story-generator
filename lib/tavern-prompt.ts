// Prompt builder for the Tavern/Inn Name generator (acquisition tool, KD0 — easy
// to rank). Returns a batch of named establishments with a one-line flavor each,
// so a GM can drop one straight into a session, then funnels to the NPC tool.
export interface TavernInput {
  vibe: string; // cozy / seedy / mysterious / upscale / rowdy
  kind: string; // tavern / inn / alehouse / teahouse
  region: string; // setting hint
  detail: string;
}

const SYSTEM = [
  "You are a tabletop RPG worldbuilding assistant. Generate a batch of establishment names.",
  "Output GitHub-flavored Markdown: exactly 12 entries as a numbered list, one per line, formatted:",
  "1. **The <Name>** — <6-12 word flavor: what's memorable, who runs it, or its quirk>",
  "Names should be evocative and varied (some whimsical, some grim, some mysterious) and fit the requested vibe and setting.",
  "",
  "Rules: original names only. Mature fantasy themes are fine; never produce real-world harmful content or any sexual content involving minors. Output ONLY the numbered list, no preamble or closing text.",
].join("\n");

export function buildTavernPrompt(i: TavernInput): { system: string; user: string } {
  const fields = [
    i.kind && `Establishment type: ${i.kind}`,
    i.vibe && `Vibe/tone: ${i.vibe}`,
    i.region && `Setting/region: ${i.region}`,
    i.detail && `Extra guidance: ${i.detail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Generate 12 establishment names matching:\n${fields}`
    : "Generate 12 evocative fantasy tavern and inn names with varied vibes.";

  return { system: SYSTEM, user };
}
