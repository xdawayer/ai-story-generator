// Net-new presentation copy for the /story-generators hub page ONLY.
// This file deliberately does NOT restate genre or RPG-tool data — those live in
// lib/story-genres.ts (STORY_GENRES) and lib/rpg-tools.ts (RPG_TOOLS) and are
// imported by the page. Everything here is hub-specific copy: the four static
// featured tools, per-genre presentation extras keyed by genre slug, the two
// display groups (slug arrays only), and the FAQ.

// The four flagship story tools are NOT in a registry, so their real routes are
// hardcoded here (verified to exist). Never link /short-story-generator or
// /story-prompt-generator — those routes do not exist.
export interface FeaturedTool {
  name: string;
  href: string;
  badge?: string;
  desc: string;
  bestFor: string;
}

export const featuredTools: readonly FeaturedTool[] = [
  {
    name: "AI Story Generator",
    href: "/",
    badge: "all-purpose",
    desc: "The all-purpose tool — any idea, any genre, in seconds. Continue it, regenerate, or save it to your library.",
    bestFor: "Best for: a quick story in any genre with no setup.",
  },
  {
    name: "Long Story Generator",
    href: "/long-story-generator",
    badge: "chapters",
    desc: "Plan a chapter outline, then write a long-form story chapter by chapter with continuity kept across chapters.",
    bestFor: "Best for: novella-length and multi-chapter work.",
  },
  {
    name: "Short Story Generator",
    href: "/story-generators/short-story",
    desc: "Turn any idea into a complete short story with a real beginning, middle, and end.",
    bestFor: "Best for: a single, self-contained story you can read in one sitting.",
  },
  {
    name: "Story Prompt Generator",
    href: "/story-generators/prompts",
    desc: "Stuck? Generate ten original writing prompts to beat the blank page, then turn one into a story.",
    bestFor: "Best for: beating writer's block and finding a spark.",
  },
] as const;

// Optional per-genre presentation extras, keyed by a STORY_GENRES slug. The page
// renders genre name + blurb from the registry and layers these on top. Every
// relatedRpgToolSlug below is a real RPG_TOOLS slug (rendered via rpgToolPath()).
export interface GenreExtra {
  bestFor?: string;
  examplePrompt?: string;
  relatedRpgToolSlug?: string;
}

export const genreExtras: Record<string, GenreExtra> = {
  fantasy: {
    bestFor: "Best for: D&D session hooks and worldbuilding legends.",
    examplePrompt: "A cartographer who can only draw places that don't exist yet.",
    relatedRpgToolSlug: "campaign-plot-generator",
  },
  "sci-fi": {
    bestFor: "Best for: space-opera one-shots and far-future settings.",
    examplePrompt: "The colony ship's AI wakes the wrong passenger on purpose.",
    relatedRpgToolSlug: "quest-hook-generator",
  },
  horror: {
    bestFor: "Best for: campfire scares and horror RPG one-shots.",
    examplePrompt: "Every photo taken in the house shows one extra person.",
    relatedRpgToolSlug: "random-encounter-generator",
  },
  mystery: {
    bestFor: "Best for: whodunits and investigation scenes at the table.",
    examplePrompt: "A locked-room theft where nothing was actually stolen.",
    relatedRpgToolSlug: "npc-generator",
  },
  romance: {
    bestFor: "Best for: a slow-burn arc or a meet-cute to read tonight.",
    examplePrompt: "Two rival bakers forced to share one tiny kitchen.",
    relatedRpgToolSlug: "character-backstory-generator",
  },
  "fairy-tale": {
    bestFor: "Best for: bedtime stories and whimsical campaign legends.",
    examplePrompt: "A village where every child is born owing the forest a favor.",
    relatedRpgToolSlug: "settlement-generator",
  },
  adventure: {
    bestFor: "Best for: a propulsive quest or a quick thrill.",
    examplePrompt: "A map that updates itself to lead the holder into danger.",
    relatedRpgToolSlug: "quest-hook-generator",
  },
  cyberpunk: {
    bestFor: "Best for: neon-noir runs and corp-intrigue one-shots.",
    examplePrompt: "A courier whose only cargo is a memory she can't access.",
    relatedRpgToolSlug: "loot-generator",
  },
  western: {
    bestFor: "Best for: weird-west sessions and lean frontier reads.",
    examplePrompt: "The only doctor in town is wanted in three territories.",
    relatedRpgToolSlug: "tavern-name-generator",
  },
};

// Display grouping for the "Browse by genre" section. Membership is just an
// ordered list of slugs — the genre data itself is read from STORY_GENRES.
export interface GenreGroup {
  title: string;
  slugs: readonly string[];
}

export const genreGroups: readonly GenreGroup[] = [
  {
    title: "Classic Fiction",
    slugs: ["mystery", "romance", "horror", "fairy-tale"],
  },
  {
    title: "Adventure & Speculative",
    slugs: ["fantasy", "sci-fi", "adventure", "cyberpunk", "western"],
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: readonly FaqItem[] = [
  {
    question: "What is the difference between these story generators?",
    answer:
      "The AI Story Generator is the all-purpose tool for any genre. The Long Story Generator writes multi-chapter, long-form work. The Short Story Generator produces a single complete tale, and the Story Prompt Generator hands you ideas when you're stuck. The genre pages are the AI Story Generator with one genre locked in.",
  },
  {
    question: "Are the story generators free?",
    answer:
      "Yes. Every generator on this page is free to use, with no login required to generate. You only create an account when you want to save stories and characters into a campaign that remembers your world.",
  },
  {
    question: "Do I need an account to generate a story?",
    answer:
      "No. You can generate, copy, and download stories without signing up. An account is only needed for saving your work across sessions.",
  },
  {
    question: "Which genres can I generate?",
    answer:
      "Fantasy, sci-fi, horror, mystery, romance, fairy tale, adventure, cyberpunk, and western each have a dedicated generator. The all-purpose AI Story Generator can also produce any genre you describe in your prompt.",
  },
  {
    question: "Can I use the stories for my tabletop RPG or D&D game?",
    answer:
      "Absolutely. The output is system-agnostic, so it drops into D&D 5e, Pathfinder, OSR games, or homebrew worlds. You can also turn a story's characters into NPCs, plots, and quest hooks with the RPG tools.",
  },
  {
    question: "Who owns the stories I create?",
    answer:
      "You do. The output is original fiction generated for you. We ask the model to avoid imitating copyrighted franchises, but always review your story before publishing or selling it.",
  },
];
