// Homepage content registry. Data-only (no JSX) so the homepage stays a static
// server component and this stays trivially testable. Links are derived from the
// shared registries (STORY_GENRES / RPG_TOOLS) wherever possible; only the four
// standalone story-tool routes are hardcoded because they have no registry.
//
// GROUND-TRUTH routes (the live URL shapes — do not "fix" these):
//   /ai-story-generator, /long-story-generator,
//   /story-generators/short-story, /story-generators/prompts,
//   /story-generators/<genre>  (via genrePath)
//   /rpg-tools/<slug>          (via rpgToolPath)
//   /campaigns, /rpg-tools, /story-generators
import { genrePath, getStoryGenre } from "@/lib/story-genres";
import { getRpgTool, rpgToolPath } from "@/lib/rpg-tools";

export type HomeCategory = "Story" | "RPG";

export interface HomeToolCard {
  title: string; // full tool name (also the visible anchor text / h3)
  description: string;
  href: string;
  cta: string;
  category: HomeCategory;
  badge?: string;
}

export interface ChoosePathItem {
  title: string; // the need, phrased in the user's voice
  description: string;
  href: string;
  cta: string;
}

export interface ExampleOutput {
  meta: string; // short label
  text: string; // hand-written sample (never a live model call)
  ctaLabel: string;
  href: string;
}

export interface WhyCard {
  title: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface DirectoryItem {
  title: string;
  href: string;
}

export interface DirectoryGroup {
  label: string;
  items: readonly DirectoryItem[];
}

// Standalone story tools that have no registry entry (the four real routes).
const AI_STORY = "/ai-story-generator";
const LONG_STORY = "/long-story-generator";
const STORY_PROMPTS = "/story-generators/prompts";

// Pull a registry RPG tool's full name, falling back to a label if a slug is
// ever renamed (keeps the homepage from 500ing on a registry change).
function rpgName(slug: string, fallback: string): string {
  return getRpgTool(slug)?.name ?? fallback;
}
function genreLabel(slug: string, fallback: string): string {
  return getStoryGenre(slug)?.h1 ?? fallback;
}

// Section 2 — "What can you generate?" (8-10 finished tool cards).
export const WHAT_YOU_CAN_GENERATE: readonly HomeToolCard[] = [
  {
    title: "AI Story Generator",
    description: "Turn any idea into a complete, original story in seconds — any genre, any tone.",
    href: AI_STORY,
    cta: "Generate a story",
    category: "Story",
  },
  {
    title: genreLabel("fantasy", "Fantasy Story Generator"),
    description: "Magic, quests, and kingdoms that never were — a finished fantasy tale on demand.",
    href: genrePath("fantasy"),
    cta: "Write fantasy",
    category: "Story",
  },
  {
    title: "Story Prompt Generator",
    description: "Stuck on a blank page? Spin up vivid, ready-to-write story prompts in any genre.",
    href: STORY_PROMPTS,
    cta: "Get prompts",
    category: "Story",
  },
  {
    title: "Long Story Generator",
    description: "Go beyond a scene — generate longer, multi-beat stories with a real arc.",
    href: LONG_STORY,
    cta: "Write a long story",
    category: "Story",
  },
  {
    title: rpgName("npc-generator", "AI NPC Generator"),
    description: "A table-ready NPC with appearance, personality, a voice, and a plot hook.",
    href: rpgToolPath("npc-generator"),
    cta: "Create an NPC",
    category: "RPG",
  },
  {
    title: rpgName("character-backstory-generator", "Character Backstory Generator"),
    description: "Origin, motivation, flaw, bond, and secret for any hero or villain.",
    href: rpgToolPath("character-backstory-generator"),
    cta: "Build a backstory",
    category: "RPG",
  },
  {
    title: rpgName("dnd-name-generator", "D&D Name Generator"),
    description: "Fast, fitting fantasy names by race and culture — your most frequent table need.",
    href: rpgToolPath("dnd-name-generator"),
    cta: "Roll names",
    category: "RPG",
  },
  {
    title: rpgName("tavern-name-generator", "Tavern Name Generator"),
    description: "Memorable taverns and inns, each with a one-line hook to drop into a session.",
    href: rpgToolPath("tavern-name-generator"),
    cta: "Name a tavern",
    category: "RPG",
  },
  {
    title: rpgName("quest-hook-generator", "Quest Hook Generator"),
    description: "A batch of ready-to-run quest hooks, each a seed for your next session.",
    href: rpgToolPath("quest-hook-generator"),
    cta: "Get quest hooks",
    category: "RPG",
  },
  {
    title: rpgName("campaign-plot-generator", "Campaign Plot Generator"),
    description: "A full campaign skeleton — premise, villain, three acts, a twist, and a climax.",
    href: rpgToolPath("campaign-plot-generator"),
    cta: "Plot a campaign",
    category: "RPG",
  },
] as const;

// Section 4 — "Choose your path" (need-based entry points).
export const CHOOSE_PATH: readonly ChoosePathItem[] = [
  {
    title: "I need a story idea",
    description: "Get an instant spark — vivid prompts you can run with in any genre.",
    href: STORY_PROMPTS,
    cta: "Get a prompt",
  },
  {
    title: "I want to write a complete story",
    description: "Turn a premise into a finished, original story with a real arc.",
    href: AI_STORY,
    cta: "Open the story generator",
  },
  {
    title: "I am preparing tonight's D&D session",
    description: "Grab quest hooks you can run at the table in minutes.",
    href: rpgToolPath("quest-hook-generator"),
    cta: "Prep hooks",
  },
  {
    title: "I need a memorable NPC",
    description: "A ready-to-run character with a voice, a face, and a reason to matter.",
    href: rpgToolPath("npc-generator"),
    cta: "Create an NPC",
  },
  {
    title: "I want to build a campaign",
    description: "Start from a premise and get a full plot skeleton to build on.",
    href: rpgToolPath("campaign-plot-generator"),
    cta: "Plot a campaign",
  },
  {
    title: "I want to continue my world",
    description: "Pick up where you left off in a campaign your tools remember.",
    href: "/campaigns",
    cta: "Open campaigns",
  },
] as const;

// Section 7 — "Example outputs" (hand-written samples + a real action link).
// Only valid prefill params are used (genre=fantasy is in GENRES; no useCase).
export const EXAMPLE_OUTPUTS: readonly ExampleOutput[] = [
  {
    meta: "Fantasy campaign opening",
    text: "The bells of Hollow Reach haven't rung in thirty years — not since the night the sea gave back its dead. Now a child has started ringing them again, and three kingdoms each want to know why before the others do.",
    ctaLabel: "Generate a campaign opening →",
    href: `${AI_STORY}?genre=fantasy`,
  },
  {
    meta: "Mysterious NPC",
    text: "Wren Calloway, the Lantern-Keeper, speaks only in questions and trades secrets for names. Nobody remembers hiring her, but the lighthouse has never once gone dark — and she knows which of the party is being followed.",
    ctaLabel: "Create an NPC →",
    href: rpgToolPath("npc-generator"),
  },
  {
    meta: "Tavern with a plot hook",
    text: "The Gilded Minnow: a riverside inn where the ale is watered and the rooms are spotless. The innkeeper pays too well for old maps, and the cellar only floods on nights with no moon.",
    ctaLabel: "Name a tavern →",
    href: rpgToolPath("tavern-name-generator"),
  },
  {
    meta: "Villain backstory",
    text: "Sir Aldric once carried wounded men three days through the Ashmarch. The order he saved repaid him with a quiet grave and a stolen name. He came back. He intends to return all of it, with interest.",
    ctaLabel: "Build a backstory →",
    href: rpgToolPath("character-backstory-generator"),
  },
] as const;

// Section 9 — "Why use AIStoryGenerator instead of a generic chat tool?"
export const WHY_CARDS: readonly WhyCard[] = [
  {
    title: "No prompt engineering",
    body: "Pick a genre and tone, drop in an idea, and generate. No system prompts, no coaxing, no wall of instructions — the tool already knows what good output looks like.",
  },
  {
    title: "Built for story structure",
    body: "Every result comes back as an actual story with a beginning, escalation, and a real ending — not a rambling chat reply that trails off mid-thought.",
  },
  {
    title: "RPG-ready outputs",
    body: "NPCs, quest hooks, plots, and names come out in the shape you run at the table, with the details a Game Master actually needs — ready to use, not reformatted by hand.",
  },
  {
    title: "Campaign memory",
    body: "Save what you make into a campaign your tools remember. Characters become NPCs, stories become plot threads, and prep compounds instead of starting from zero each week.",
  },
] as const;

// Section 10 — FAQ (kept in sync with the visible FAQ + FAQPage JSON-LD).
export const HOME_FAQ: readonly FaqItem[] = [
  {
    q: "Is it free?",
    a: "Yes. Every generator is free to use and you can copy or download what you create instantly. Saving your work into a persistent campaign is the optional next step.",
  },
  {
    q: "Do I need to log in?",
    a: "No login is required to generate. You only create an account when you want to save stories, NPCs, and campaign notes so your tools remember them across sessions.",
  },
  {
    q: "Can I use it for D&D and other tabletop RPGs?",
    a: "Absolutely. It's built for tabletop play — D&D 5e, Pathfinder, OSR retroclones, homebrew worlds, and solo RPGs. The content is system-agnostic, so it drops into any ruleset.",
  },
  {
    q: "What can I generate?",
    a: "Complete stories in any genre, plus RPG assets: NPCs, character backstories, quest hooks, campaign plots, D&D and tavern names, encounters, magic items, and more. Use them on their own or weave them into a campaign.",
  },
  {
    q: "How does campaign memory work?",
    a: "Create a free account and you can save stories, NPCs, factions, locations, and plot threads into a campaign. Everything you keep stays linked to your world, so each tool builds on what you already have.",
  },
  {
    q: "Can I continue or extend what I generate?",
    a: "Yes. Continue a story beat by beat, regenerate for a fresh take, rewrite the tone, or extract its cast as NPCs. Nothing is one-and-done — every result is a starting point you can build on.",
  },
  {
    q: "Who owns the content I generate?",
    a: "You do. Output is original fiction generated for you. We ask the model to avoid imitating copyrighted franchises, but always review before publishing.",
  },
  {
    q: "Can I use it commercially?",
    a: "Yes — you can use the output in your own commercial work, including published adventures and streamed games. Review it first to make sure it fits your needs and is original.",
  },
  {
    q: "Who is it for?",
    a: "Game Masters and players running D&D and other tabletop RPGs, solo roleplayers, worldbuilders, and writers who want a fast, structured starting point instead of a blank page.",
  },
  {
    q: "What about privacy?",
    a: "We collect as little as possible and don't sell your data. See our privacy policy for exactly what's processed and why.",
  },
] as const;

// Section 5 — "Free AI generators" directory, grouped. Story genres and RPG
// tools are derived from the shared registries so the directory can't drift.
export const STORY_DIRECTORY: DirectoryGroup = {
  label: "Story Generators",
  items: [
    { title: "AI Story Generator", href: AI_STORY },
    { title: genreLabel("fantasy", "Fantasy Story Generator"), href: genrePath("fantasy") },
    { title: genreLabel("sci-fi", "Sci-Fi Story Generator"), href: genrePath("sci-fi") },
    { title: genreLabel("horror", "Horror Story Generator"), href: genrePath("horror") },
    { title: genreLabel("mystery", "Mystery Story Generator"), href: genrePath("mystery") },
    { title: genreLabel("romance", "Romance Story Generator"), href: genrePath("romance") },
    { title: "Long Story Generator", href: LONG_STORY },
    { title: "Story Prompt Generator", href: STORY_PROMPTS },
  ],
} as const;

export const RPG_DIRECTORY: DirectoryGroup = {
  label: "RPG Tools",
  items: [
    { title: rpgName("npc-generator", "AI NPC Generator"), href: rpgToolPath("npc-generator") },
    {
      title: rpgName("character-backstory-generator", "Character Backstory Generator"),
      href: rpgToolPath("character-backstory-generator"),
    },
    { title: rpgName("dnd-name-generator", "D&D Name Generator"), href: rpgToolPath("dnd-name-generator") },
    { title: rpgName("tavern-name-generator", "Tavern Name Generator"), href: rpgToolPath("tavern-name-generator") },
    {
      title: rpgName("campaign-plot-generator", "Campaign Plot Generator"),
      href: rpgToolPath("campaign-plot-generator"),
    },
    { title: rpgName("quest-hook-generator", "Quest Hook Generator"), href: rpgToolPath("quest-hook-generator") },
    {
      title: rpgName("random-encounter-generator", "Random Encounter Generator"),
      href: rpgToolPath("random-encounter-generator"),
    },
    { title: rpgName("magic-item-generator", "Magic Item Generator"), href: rpgToolPath("magic-item-generator") },
  ],
} as const;

// Section 6 — "Built for tabletop RPG sessions" system/style chips.
export const RPG_SYSTEMS: readonly string[] = [
  "D&D 5e",
  "Pathfinder",
  "OSR & retroclones",
  "Homebrew worlds",
  "Solo RPG",
  "One-shots",
  "Long campaigns",
  "Mystery sessions",
  "Horror one-shots",
  "Fantasy sandboxes",
] as const;

// Quick Start prompt chips (fill the input; do not navigate).
export const QUICK_START_CHIPS: readonly string[] = [
  "Fantasy quest",
  "Cursed tavern",
  "Mysterious NPC",
  "Campaign opening",
  "Haunted village",
  "Lost kingdom",
] as const;
