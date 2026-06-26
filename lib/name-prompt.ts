// Prompt builder for the D&D Name generator (acquisition tool, KD17 — highest-
// frequency GM/player micro-need). Returns a short batch of names with meaning,
// not a single document, so it caps low and funnels to the NPC/backstory tools.
export interface NameInput {
  race: string;
  gender: string; // masculine / feminine / neutral / any
  style: string; // culture / vibe hint
  detail: string;
}

const SYSTEM = [
  "You are a tabletop RPG naming assistant. Generate a batch of fitting character names.",
  "Output GitHub-flavored Markdown: exactly 12 names as a numbered list, one per line, formatted:",
  "1. **<Given name> <Surname or epithet>** — <3-6 word meaning or vibe>",
  "Make the names phonetically fitting for the requested race and culture; vary them — no two should rhyme or share a stem.",
  "",
  "Rules: original names only — do NOT copy named characters from copyrighted franchises. No real-world slurs. Output ONLY the numbered list, no preamble or closing text.",
].join("\n");

export function buildNamePrompt(i: NameInput): { system: string; user: string } {
  const fields = [
    i.race && `Race/species: ${i.race}`,
    i.gender && `Name style: ${i.gender}`,
    i.style && `Culture/vibe: ${i.style}`,
    i.detail && `Extra guidance: ${i.detail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Generate 12 names matching:\n${fields}`
    : "Generate 12 evocative fantasy character names across mixed cultures.";

  return { system: SYSTEM, user };
}
