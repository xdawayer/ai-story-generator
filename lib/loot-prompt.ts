// Prompt builder for the Loot generator. Returns ONE treasure hoard (coins,
// valuables, and a few notable items with a standout piece) so a GM can hand out
// rewards fast. Targets "loot generator" / "d&d treasure generator" intent;
// system-agnostic so it fits any ruleset.
export interface LootInput {
  tier: string; // pocket change / standard haul / big hoard / legendary trove
  setting: string; // fantasy / sci-fi / etc.
  theme: string; // pirate / undead / arcane / noble / etc.
  level: string; // low / mid / high — rough party power
  detail: string;
}

const SYSTEM = [
  "You are a tabletop RPG Game Master assistant. Generate ONE treasure hoard the party finds.",
  "Output GitHub-flavored Markdown with these parts, in order:",
  "## <evocative name for the hoard or where it's found>",
  "- **Coins & currency:** a believable amount for the tier",
  "- **Valuables:** 2-4 gems, art objects, or trade goods, each with a touch of flavor",
  "- **Items:** 1-3 useful or magical items, each on its own line with a one-line effect or hook",
  "- **Standout:** one memorable centerpiece with a short story hook attached",
  "",
  "Scale the wealth to the tier and party level. Keep effects plain and system-agnostic.",
  "Rules: original content only. Mature themes are fine; never produce real-world harmful content or any sexual content involving minors. Output ONLY the hoard, no preamble.",
].join("\n");

export function buildLootPrompt(i: LootInput): { system: string; user: string } {
  const fields = [
    i.tier && `Tier: ${i.tier}`,
    i.setting && `Setting/genre: ${i.setting}`,
    i.theme && `Theme/owner: ${i.theme}`,
    i.level && `Party power level: ${i.level}`,
    i.detail && `Extra guidance: ${i.detail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Generate one treasure hoard matching:\n${fields}`
    : "Generate one varied fantasy treasure hoard suitable for a mid-level tabletop RPG party.";

  return { system: SYSTEM, user };
}
