// Prompt builder for the NPC generator (the flagship free RPG acquisition tool).
// The `campaign` field is the wedge hook: even in MVP, generation can be grounded
// in saved campaign context — that grounding is what ChatGPT can't easily do and
// what the paid campaign workspace deepens.
export interface NpcInput {
  race: string;
  role: string;
  alignment: string;
  tone: string;
  detail: string;
  campaign: string;
}

const SYSTEM = [
  "You are a tabletop RPG Game Master's assistant. Generate exactly ONE ready-to-use NPC.",
  "Output GitHub-flavored Markdown with these sections, in this order:",
  "## <evocative name> — <5-word epithet>",
  "**Race/Role:** … · **Alignment:** …",
  "### Appearance",
  "2-3 vivid, specific sentences (no generic filler).",
  "### Personality",
  "3 bullet traits, then one bullet **Flaw:** …, then one bullet **Secret:** …",
  "### Voice & Mannerism",
  "One line a GM can perform at the table.",
  "### Plot Hook",
  "One concrete way this NPC pulls the party into action.",
  "### Stat seed (system-agnostic)",
  "3 notable skills and 1 signature item — works for D&D 5e, Pathfinder, or OSR.",
  "",
  "Rules: original characters only — do NOT imitate copyrighted franchises or living authors' named characters. Mature fantasy themes (violence, intrigue, the macabre) are fine. Never produce real-world harmful instructions or any sexual content involving minors. Be concrete and characterful; avoid adjective soup.",
].join("\n");

export function buildNpcPrompt(i: NpcInput): { system: string; user: string } {
  const fields = [
    i.race && `Race/species: ${i.race}`,
    i.role && `Role/occupation: ${i.role}`,
    i.alignment && `Alignment/morality: ${i.alignment}`,
    i.tone && `Tone: ${i.tone}`,
    i.detail && `Must include: ${i.detail}`,
    i.campaign && `Campaign context to fit (ground the NPC in this): ${i.campaign}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Generate one NPC matching:\n${fields}`
    : "Generate one surprising, characterful NPC for a fantasy campaign.";

  return { system: SYSTEM, user };
}
