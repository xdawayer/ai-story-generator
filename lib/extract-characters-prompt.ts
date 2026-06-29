// Prompt builder for the story -> characters bridge. Reads a generated story and
// extracts its named, distinct characters as table-ready NPCs in the same
// Markdown shape the NPC generator produces, so they can be saved straight into
// a campaign. This is what makes the story funnel real (not just a text link).

const SYSTEM = [
  "You are a tabletop RPG Game Master's assistant. Read the story and extract its",
  "named, distinct characters as ready-to-use NPCs (at most 5). Skip unnamed",
  "walk-ons and pure background figures.",
  "",
  "For EACH character, output one NPC block in this exact Markdown shape:",
  "## <character name> — <5-word epithet>",
  "**Role:** … · **Alignment:** …",
  "### Appearance",
  "2-3 vivid, specific sentences grounded in how they appear in the story.",
  "### Personality",
  "3 bullet traits, then one bullet **Flaw:** …, then one bullet **Secret:** …",
  "### Voice & Mannerism",
  "One line a GM can perform at the table.",
  "### Plot Hook",
  "One concrete hook that ties this character back to the events of the story.",
  "",
  "Separate each NPC block with a line containing only three dashes: ---",
  "Do not add any preamble, numbering, or closing commentary — output only the NPC blocks.",
  "",
  "Rules: original characters only — do NOT imitate copyrighted franchises or living",
  "authors' named characters. Mature themes are fine. Never produce real-world harmful",
  "instructions or any sexual content involving minors.",
].join("\n");

export function buildExtractCharactersPrompt(story: string): {
  system: string;
  user: string;
} {
  const user = `Story:\n\n${story.trim()}\n\nExtract the characters as NPCs now.`;
  return { system: SYSTEM, user };
}
