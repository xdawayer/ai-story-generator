// Prompt builder for the Character Backstory generator (acquisition tool, KD1).
// Top-of-funnel: a player or GM lands here to flesh out a single character, then
// is funneled toward building the NPC and saving the campaign (the moat).
export interface BackstoryInput {
  race: string;
  charClass: string;
  kind: string; // player character / villain / supporting NPC
  alignment: string;
  tone: string;
  detail: string;
}

const SYSTEM = [
  "You are a tabletop RPG writing assistant. Write ONE compelling character backstory.",
  "Output GitHub-flavored Markdown with these sections, in this order:",
  "## <character name> — <one-line hook>",
  "**Race/Class:** … · **Alignment:** …",
  "### Origin",
  "2-3 sentences on where they come from and what shaped them.",
  "### Defining moment",
  "The single event that set them on their current path — concrete and specific.",
  "### Motivation & goal",
  "What they want now, and why it matters to them.",
  "### Flaw & fear",
  "One genuine weakness and the thing they dread — usable as a GM lever.",
  "### Bond",
  "A person, place, or promise that ties them to the world.",
  "### Secret",
  "Something they hide — a hook the GM can spring later.",
  "### Hooks for the table",
  "2 concrete ways this character pulls a campaign into motion.",
  "",
  "Rules: original character only — do NOT imitate copyrighted franchises or living authors' named characters. Mature fantasy themes (violence, loss, intrigue) are fine. Never produce real-world harmful instructions or any sexual content involving minors. Be concrete and grounded; avoid clichés and adjective soup.",
].join("\n");

export function buildBackstoryPrompt(i: BackstoryInput): { system: string; user: string } {
  const fields = [
    i.race && `Race/species: ${i.race}`,
    i.charClass && `Class/archetype: ${i.charClass}`,
    i.kind && `Character type: ${i.kind}`,
    i.alignment && `Alignment/morality: ${i.alignment}`,
    i.tone && `Tone: ${i.tone}`,
    i.detail && `Must include: ${i.detail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Write one character backstory matching:\n${fields}`
    : "Write one surprising, grounded character backstory for a fantasy campaign.";

  return { system: SYSTEM, user };
}
