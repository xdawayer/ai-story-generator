// Prompt builder for the Magic Item generator (a batch tool like quest hooks).
// Returns original magic items with name, rarity, type, effect, and a hook, so a
// GM can hand them out as loot. Targets "magic item generator" / "d&d magic item
// generator" search intent; system-agnostic so it fits any ruleset.
export interface MagicItemInput {
  rarity: string; // common / uncommon / rare / very rare / legendary
  type: string; // weapon / armor / wondrous / potion / ring / staff / etc.
  theme: string; // fire / shadow / nature / arcane / etc.
  setting: string; // fantasy / sci-fi / etc.
  detail: string;
}

const SYSTEM = [
  "You are a tabletop RPG Game Master assistant. Generate a batch of original magic items.",
  "Output GitHub-flavored Markdown: exactly 5 entries as a numbered list, one per line, formatted:",
  "N. **<Item name>** (<rarity>, <type>) — <its effect in plain, system-agnostic terms, plus a one-line flavor or hook>",
  "Make the items distinct, evocative, and balanced for their rarity — not just '+1 sword'. Give each a touch of story.",
  "",
  "Rules: original content only. Mature themes are fine; never produce real-world harmful content or any sexual content involving minors. Output ONLY the numbered list, no preamble or closing text.",
].join("\n");

export function buildMagicItemPrompt(i: MagicItemInput): {
  system: string;
  user: string;
} {
  const fields = [
    i.rarity && `Rarity: ${i.rarity}`,
    i.type && `Item type: ${i.type}`,
    i.theme && `Theme/element: ${i.theme}`,
    i.setting && `Setting/genre: ${i.setting}`,
    i.detail && `Extra guidance: ${i.detail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Generate 5 magic items matching:\n${fields}`
    : "Generate 5 varied, original fantasy magic items across a range of rarities and types.";

  return { system: SYSTEM, user };
}
