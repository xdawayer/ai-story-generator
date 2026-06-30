// Per-tool long-form content for the RPG tool landing pages, centralized the same
// way genre copy lives in lib/story-genres.ts. Data-only (no JSX) so it stays
// trivially testable and can be imported by server components. Rendered by
// components/tool-sections.tsx (What is / examples / Who for) and
// components/related-tools.tsx (cross-links). Only the priority tools (by KDROI)
// carry full ToolContent; every tool has a Related-tools mapping.

export interface ToolExample {
  title: string;
  body: string;
}

export interface ToolWhoFor {
  who: string;
  why: string;
}

export interface ToolContent {
  whatIs: readonly string[]; // 1-2 paragraphs for "What is the X?"
  examples: readonly ToolExample[]; // 3 sample outputs for "X examples"
  whoFor: readonly ToolWhoFor[]; // 3 audiences for "Who is the X for?"
}

// Full body content, keyed by RPG tool slug. Expand this map to give more tool
// pages the same section set; pages with no entry just render their existing
// hero + how-it-works + FAQ + Related tools.
export const TOOL_CONTENT: Record<string, ToolContent> = {
  "magic-item-generator": {
    whatIs: [
      "The magic item generator is a free tool that turns a few choices — rarity, item type, and theme — into original magic items for D&D and tabletop RPGs. Each item comes with a name, a rarity tier, a plain-language effect, and a short story hook, so it reads like treasure with a history rather than a line on a spreadsheet.",
      "Because the effects are written in system-agnostic terms, the items drop into D&D 5e, Pathfinder, OSR retroclones, or any homebrew world — you set the exact numbers to match your ruleset.",
    ],
    examples: [
      {
        title: "A common trinket with a hook",
        body: "Tidewarden's Compass (common): always points to the nearest open water, and twitches when that water is hiding something.",
      },
      {
        title: "A rare weapon",
        body: "Ashvow Blade (rare): grows warm near a lie; once per day its bearer can ask one question the blade answers with heat for true, cold for false.",
      },
      {
        title: "A legendary centerpiece",
        body: "The Hollow Crown (legendary): lends a ruler's presence to any command, but every order it strengthens is one the wearer can never take back.",
      },
    ],
    whoFor: [
      {
        who: "Game Masters prepping loot",
        why: "Hand out treasure that carries a story hook instead of a flat +1, in seconds.",
      },
      {
        who: "Homebrewers and designers",
        why: "Spin up a batch of seed ideas, then file the rarity and numbers down to fit your system.",
      },
      {
        who: "Players and worldbuilders",
        why: "Give a character a signature item with a past worth roleplaying.",
      },
    ],
  },

  "tavern-name-generator": {
    whatIs: [
      "The tavern name generator creates memorable taverns and inns for D&D and tabletop RPGs — twelve at a time, each with a one-line hook about who runs it or what makes it worth a scene. It turns a flat “you arrive at an inn” into a place the party actually remembers.",
      "Names and hooks are system-agnostic, so they fit D&D 5e, Pathfinder, OSR, and any fantasy setting. Pick an establishment type and a vibe — cozy, seedy, haunted, upscale — to steer the batch.",
    ],
    examples: [
      {
        title: "Cozy roadside inn",
        body: "The Mended Kettle — run by a retired cleric who trades a hot meal and a clean bed for news from the road.",
      },
      {
        title: "Seedy dockside tavern",
        body: "The Drowned Lantern — the ale is watered, the dice are loaded, and the cellar floods only on moonless nights.",
      },
      {
        title: "Haunted alehouse",
        body: "The Last Round — the regulars never leave, and one stool stays empty for the founder who died mid-pour.",
      },
    ],
    whoFor: [
      {
        who: "GMs improvising a session",
        why: "Drop a ready watering hole into play the moment the party wanders off the map.",
      },
      {
        who: "Campaign worldbuilders",
        why: "Stock a town with distinct establishments that each come with a hook.",
      },
      {
        who: "Writers and players",
        why: "Name the place a character calls home, with a detail worth roleplaying.",
      },
    ],
  },

  "character-backstory-generator": {
    whatIs: [
      "The character backstory generator builds a complete past for a player character, villain, or supporting NPC: an origin, a defining moment, a motivation, a flaw, a bond, and a secret. It gives a character something to play toward and something to hide, instead of a wall of generic lore.",
      "It works for D&D 5e, Pathfinder, OSR, and any tabletop RPG — backstories are narrative and system-agnostic. Set a race and class and it shapes the past around your build, so it doubles as a dnd backstory generator.",
    ],
    examples: [
      {
        title: "Player character",
        body: "A cleric who lost her faith the day her prayers worked — and she watched what answered. Now she heals on instinct and dreads being thanked.",
      },
      {
        title: "Villain",
        body: "A knight who carried wounded men three days through the Ashmarch, then was repaid with a quiet grave and a stolen name. He came back to collect, with interest.",
      },
      {
        title: "Supporting NPC",
        body: "A fence who only deals in things people regret selling, because he is slowly buying back the pieces of a life he gambled away.",
      },
    ],
    whoFor: [
      {
        who: "Players building a character",
        why: "Turn a race and class into someone with a wound, a want, and a secret to play.",
      },
      {
        who: "GMs writing villains and NPCs",
        why: "Give an antagonist a past that drives the plot instead of a flat motive.",
      },
      {
        who: "Writers and worldbuilders",
        why: "Draft a character history fast, then keep what fits and rewrite the rest.",
      },
    ],
  },

  "dnd-name-generator": {
    whatIs: [
      "The D&D name generator produces fast, fitting fantasy names by race and culture — the highest-frequency need at the table. Instead of stalling a session to invent a name on the spot, you get a batch that already sounds like it belongs to a dwarf, an elf, a tiefling, or a human from a particular region.",
      "Names are system-agnostic and work for D&D 5e, Pathfinder, and any fantasy world — for player characters, the NPC the party just cornered, towns, taverns, and more.",
    ],
    examples: [
      {
        title: "Elf names",
        body: "Aelar Nightbreeze · Sylvaris Moonwhisper · Thaelen Dawnsong · Maeral Silverleaf",
      },
      {
        title: "Dwarf names",
        body: "Brungar Ironvow · Dela Stonehand · Thordin Coalbeard · Hilda Deepdelve",
      },
      {
        title: "Tiefling names",
        body: "Vex Ashmourne · Calanthe Hex · Damaris Vow · Mortis Quill",
      },
    ],
    whoFor: [
      {
        who: "GMs who improvise",
        why: "Name the NPC the party just cornered before the silence gets awkward.",
      },
      {
        who: "Players rolling up characters",
        why: "Find a name that fits your race, class, and backstory in one click.",
      },
      {
        who: "Worldbuilders",
        why: "Name a region's people consistently so the whole setting feels coherent.",
      },
    ],
  },

  "random-encounter-generator": {
    whatIs: [
      "The random encounter generator builds a batch of ready-to-run encounters — combat, social, and environmental — each with a situation and a twist you can drop into any scene. It fills the gap between plot beats with something that actually matters, not just another fight.",
      "Encounters are system-agnostic, so they suit D&D 5e, Pathfinder, OSR, and homebrew. Set a biome or location and a difficulty to steer the batch toward your table.",
    ],
    examples: [
      {
        title: "Combat with a twist",
        body: "Bandits ambush the party — but they are starving deserters who would rather be talked down than killed, if anyone offers.",
      },
      {
        title: "Social encounter",
        body: "A toll-keeper demands payment for a bridge that washed out years ago; he does not know, or will not admit, that it is gone.",
      },
      {
        title: "Environmental hazard",
        body: "The trail crosses a frozen lake that groans underfoot — and something large is moving beneath the ice.",
      },
    ],
    whoFor: [
      {
        who: "GMs prepping or improvising",
        why: "Keep a stack of encounters ready for travel, downtime, or a lull in the plot.",
      },
      {
        who: "Solo and sandbox players",
        why: "Seed an open hex with situations that react to wherever the party goes.",
      },
      {
        who: "New GMs",
        why: "Learn encounter design from examples that pair a clear situation with a twist.",
      },
    ],
  },
};

export function getToolContent(slug: string): ToolContent | undefined {
  return TOOL_CONTENT[slug];
}

// Related-tools cross-links for every RPG tool page (the P3 internal-linking
// requirement). Each list is 4 sibling slugs; the component also links the hub.
export const RELATED_TOOLS: Record<string, readonly string[]> = {
  "npc-generator": [
    "character-backstory-generator",
    "dnd-name-generator",
    "quest-hook-generator",
    "random-encounter-generator",
  ],
  "character-backstory-generator": [
    "npc-generator",
    "dnd-name-generator",
    "quest-hook-generator",
    "campaign-plot-generator",
  ],
  "dnd-name-generator": [
    "npc-generator",
    "character-backstory-generator",
    "tavern-name-generator",
    "settlement-generator",
  ],
  "tavern-name-generator": [
    "settlement-generator",
    "npc-generator",
    "quest-hook-generator",
    "dnd-name-generator",
  ],
  "campaign-plot-generator": [
    "quest-hook-generator",
    "npc-generator",
    "random-encounter-generator",
    "dungeon-generator",
  ],
  "quest-hook-generator": [
    "campaign-plot-generator",
    "npc-generator",
    "random-encounter-generator",
    "magic-item-generator",
  ],
  "random-encounter-generator": [
    "npc-generator",
    "magic-item-generator",
    "dungeon-generator",
    "quest-hook-generator",
  ],
  "magic-item-generator": [
    "loot-generator",
    "random-encounter-generator",
    "npc-generator",
    "dungeon-generator",
  ],
  "loot-generator": [
    "magic-item-generator",
    "random-encounter-generator",
    "dungeon-generator",
    "npc-generator",
  ],
  "dungeon-generator": [
    "random-encounter-generator",
    "magic-item-generator",
    "settlement-generator",
    "npc-generator",
  ],
  "settlement-generator": [
    "tavern-name-generator",
    "npc-generator",
    "quest-hook-generator",
    "dnd-name-generator",
  ],
};

export function getRelatedTools(slug: string): readonly string[] {
  return RELATED_TOOLS[slug] ?? [];
}
