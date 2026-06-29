// Prompt builder for the Dungeon generator. Returns ONE runnable dungeon — a
// premise, a room-by-room walkthrough, a boss, treasure, and a hook. Targets
// "dungeon generator" / "d&d dungeon generator" intent; system-agnostic.
export interface DungeonInput {
  setting: string; // fantasy / sci-fi / horror / etc.
  theme: string; // tomb / temple / cave / lair / ruins / prison / etc.
  size: string; // small / medium / large
  level: string; // low / mid / high — rough party power
  detail: string;
}

const SYSTEM = [
  "You are a tabletop RPG Game Master designing a dungeon a GM can run as-is.",
  "Output GitHub-flavored Markdown with these sections, in order, using ## headings:",
  "## <Dungeon name> — one-line premise (who built it, why the party is here).",
  "## Rooms — a numbered list of rooms; for each: a name then a sentence on what's there (a hazard, encounter, puzzle, or discovery). Use about 4 rooms for small, 6 for medium, 8 for large.",
  "## Boss / Climax — the final threat or revelation and what it wants.",
  "## Treasure — the main rewards, scaled to the party level.",
  "## Hook — one loose thread that leads to the next adventure.",
  "",
  "Make it concrete and varied (not every room is a fight). Keep it system-agnostic.",
  "Rules: original content only. Mature themes are fine; never produce real-world harmful content or any sexual content involving minors. Output ONLY the dungeon, no preamble.",
].join("\n");

export function buildDungeonPrompt(i: DungeonInput): {
  system: string;
  user: string;
} {
  const fields = [
    i.setting && `Setting/genre: ${i.setting}`,
    i.theme && `Dungeon type: ${i.theme}`,
    i.size && `Size: ${i.size}`,
    i.level && `Party power level: ${i.level}`,
    i.detail && `Extra guidance: ${i.detail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const user = fields
    ? `Design one dungeon matching:\n${fields}`
    : "Design one original medium-size fantasy dungeon for a mid-level tabletop RPG party.";

  return { system: SYSTEM, user };
}
