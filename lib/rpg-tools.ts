// Single source of truth for the RPG / Game Master tools that live under the
// /rpg-tools/ hub. Data-only (no JSX) so it can be imported by the server-side
// sitemap, the global nav, and the hub page alike. The hub maps each slug to a
// lucide icon at render time; keeping icons out of here avoids pulling a client
// dependency into server modules.
export interface RpgTool {
  slug: string; // URL segment under /rpg-tools, e.g. "npc-generator"
  nav: string; // short label for the primary nav
  name: string; // full tool name / card heading
  blurb: string; // one-line description for the hub card + nav
}

export const RPG_TOOLS: readonly RpgTool[] = [
  {
    slug: "npc-generator",
    nav: "NPC",
    name: "AI NPC Generator",
    blurb:
      "Race, role, alignment, and tone in — a ready-to-run NPC with appearance, personality, voice, and a plot hook out.",
  },
  {
    slug: "character-backstory-generator",
    nav: "Backstory",
    name: "Character Backstory Generator",
    blurb:
      "Origin, defining moment, motivation, flaw, bond, and secret — for player characters and villains alike.",
  },
  {
    slug: "dnd-name-generator",
    nav: "Names",
    name: "D&D Name Generator",
    blurb:
      "Fast, fitting names by race and culture — the highest-frequency micro-need at the table.",
  },
  {
    slug: "tavern-name-generator",
    nav: "Taverns",
    name: "Tavern Name Generator",
    blurb:
      "Memorable taverns and inns, each with a one-line hook you can drop straight into a session.",
  },
  {
    slug: "campaign-plot-generator",
    nav: "Plots",
    name: "Campaign Plot Generator",
    blurb:
      "A full campaign skeleton — premise, villain, three acts, a twist, and a climax — from a one-line idea.",
  },
  {
    slug: "quest-hook-generator",
    nav: "Quests",
    name: "Quest Hook Generator",
    blurb:
      "A batch of ready-to-run quest hooks, each a one-or-two-sentence seed for your next session.",
  },
  {
    slug: "random-encounter-generator",
    nav: "Encounters",
    name: "Random Encounter Generator",
    blurb:
      "A batch of random encounters — combat, social, and environmental — each with a situation and a twist to drop into any scene.",
  },
  {
    slug: "magic-item-generator",
    nav: "Magic Items",
    name: "Magic Item Generator",
    blurb:
      "Original magic items with a name, rarity, type, effect, and a hook — ready to hand out as loot.",
  },
  {
    slug: "loot-generator",
    nav: "Loot",
    name: "Loot Generator",
    blurb:
      "A complete treasure hoard — coins, valuables, and notable items with a standout centerpiece.",
  },
  {
    slug: "dungeon-generator",
    nav: "Dungeons",
    name: "Dungeon Generator",
    blurb:
      "A runnable dungeon — premise, room-by-room walkthrough, a boss, treasure, and a hook to what's next.",
  },
  {
    slug: "settlement-generator",
    nav: "Settlements",
    name: "Settlement Generator",
    blurb:
      "A town the party can walk into — vibe, notable locations, people to meet, and trouble brewing.",
  },
] as const;

export function getRpgTool(slug: string): RpgTool | undefined {
  return RPG_TOOLS.find((t) => t.slug === slug);
}

// Canonical path for an RPG tool page, e.g. rpgToolPath("npc-generator") →
// "/rpg-tools/npc-generator". Single source of truth for the tool URL shape.
export function rpgToolPath(slug: string): string {
  return `/rpg-tools/${slug}`;
}
