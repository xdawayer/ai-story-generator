// Programmatic SEO surface: one rankable landing page per story genre, each a
// near-exact match for a "<genre> story generator" head term. All pages reuse
// the same streaming engine (StoryGenerator with a locked genre) and funnel into
// the campaign workspace. Add a genre here and a new page exists automatically
// (app/story-generators/[slug]/page.tsx reads this list via generateStaticParams).

export interface StoryGenre {
  slug: string; // short URL segment under /story-generators, e.g. "fantasy"
  genre: string; // value sent to the model (locks the genre select)
  label: string; // short human label
  h1: string;
  title: string; // <title>
  description: string; // meta description
  keywords: string[];
  lead: string; // hero subheading
  blurb: string; // one SEO paragraph for the body
  accent: string; // per-genre theme color (hex)
  illustration?: string; // optional hero background (falls back to gradient)
}

export const STORY_GENRES: readonly StoryGenre[] = [
  {
    slug: "fantasy",
    genre: "Fantasy",
    label: "Fantasy",
    h1: "Fantasy Story Generator",
    title: "Fantasy Story Generator — Free, No Login",
    description:
      "Free fantasy story generator. Turn any idea into an original tale of magic, quests, and strange kingdoms in seconds — no sign-up. Then build it into a campaign.",
    keywords: [
      "fantasy story generator",
      "ai fantasy story generator",
      "free fantasy story generator",
      "fantasy short story generator",
    ],
    lead: "Conjure an original fantasy tale in seconds — magic, quests, and kingdoms that never were. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "Whether you need a folktale for a worldbuilding doc, a hook for a D&D session, or just a spark for your own novel, the fantasy story generator gives you an original arc with real characters — not generic filler.",
    accent: "#67d99a",
    illustration: "/illustrations/hero-fantasy.jpg",
  },
  {
    slug: "sci-fi",
    genre: "Sci-fi",
    label: "Sci-Fi",
    h1: "Sci-Fi Story Generator",
    title: "Sci-Fi Story Generator — Free, No Login",
    description:
      "Free sci-fi story generator. Turn any idea into an original science fiction story — starships, AI, far futures — in seconds, no sign-up. Then build it into a campaign.",
    keywords: [
      "sci-fi story generator",
      "science fiction story generator",
      "ai sci-fi story generator",
      "free sci fi story generator",
    ],
    lead: "Spin up an original science fiction story in seconds — starships, rogue AI, and far-future worlds. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "From hard sci-fi to space opera, the sci-fi story generator turns a premise into a tight story with a real arc — perfect for a sci-fi RPG session, a writing prompt, or a quick read.",
    accent: "#7cc7ff",
    illustration: "/illustrations/hero-sci-fi.jpg",
  },
  {
    slug: "horror",
    genre: "Horror",
    label: "Horror",
    h1: "Horror Story Generator",
    title: "Horror Story Generator — Free, No Login",
    description:
      "Free horror story generator. Turn any idea into an original scary story — dread, the uncanny, the macabre — in seconds, no sign-up. Then build it into a campaign.",
    keywords: [
      "horror story generator",
      "scary story generator",
      "ai horror story generator",
      "free horror story generator",
    ],
    lead: "Generate an original horror story in seconds — dread, the uncanny, and the macabre. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "Need a creepypasta-style tale, a one-shot for a horror RPG, or a scare to read aloud? The horror story generator builds atmosphere and a real twist, not just gore.",
    accent: "#ff6b6b",
    illustration: "/illustrations/hero-horror.jpg",
  },
  {
    slug: "mystery",
    genre: "Mystery",
    label: "Mystery",
    h1: "Mystery Story Generator",
    title: "Mystery Story Generator — Free, No Login",
    description:
      "Free mystery story generator. Turn any idea into an original whodunit — clues, suspects, a twist — in seconds, no sign-up. Then build it into a campaign.",
    keywords: [
      "mystery story generator",
      "whodunit generator",
      "ai mystery story generator",
      "detective story generator",
    ],
    lead: "Craft an original mystery in seconds — clues, suspects, and a satisfying twist. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "The mystery story generator plots a tight whodunit with motive and misdirection — a ready investigation scene for a tabletop session or a quick read.",
    accent: "#b69cff",
    illustration: "/illustrations/hero-mystery.jpg",
  },
  {
    slug: "romance",
    genre: "Romance",
    label: "Romance",
    h1: "Romance Story Generator",
    title: "Romance Story Generator — Free, No Login",
    description:
      "Free romance story generator. Turn any idea into an original love story — tension, chemistry, a turning point — in seconds, no sign-up.",
    keywords: [
      "romance story generator",
      "love story generator",
      "ai romance story generator",
      "free romance story generator",
    ],
    lead: "Write an original romance in seconds — chemistry, tension, and a turning point that lands. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "From meet-cute to slow burn, the romance story generator gives you characters with real wants and a genuine emotional arc — a spark for your own writing or a quick read.",
    accent: "#ff9ec7",
    illustration: "/illustrations/hero-romance.jpg",
  },
  {
    slug: "fairy-tale",
    genre: "Fairy tale",
    label: "Fairy Tale",
    h1: "Fairy Tale Generator",
    title: "Fairy Tale Generator — Free, No Login",
    description:
      "Free fairy tale generator. Turn any idea into an original fairy tale — wonder, a lesson, a touch of the strange — in seconds, no sign-up.",
    keywords: [
      "fairy tale generator",
      "ai fairy tale generator",
      "free fairy tale generator",
      "fairytale story generator",
    ],
    lead: "Spin an original fairy tale in seconds — wonder, a quiet lesson, and a touch of the strange. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "The fairy tale generator writes original tales in the classic voice — great for bedtime stories, a creative prompt, or a whimsical campaign legend.",
    accent: "#ffd98e",
    illustration: "/illustrations/hero-fairy-tale.jpg",
  },
  {
    slug: "adventure",
    genre: "Adventure",
    label: "Adventure",
    h1: "Adventure Story Generator",
    title: "Adventure Story Generator — Free, No Login",
    description:
      "Free adventure story generator. Turn any idea into an original tale of danger, discovery, and high stakes in seconds, no sign-up. Then build it into a campaign.",
    keywords: [
      "adventure story generator",
      "ai adventure story generator",
      "free adventure story generator",
      "action story generator",
    ],
    lead: "Spin up an original adventure in seconds — danger, discovery, and high stakes. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "The adventure story generator builds a propulsive arc with a real goal and obstacles — a ready quest for a tabletop session, a writing prompt, or a quick thrill.",
    accent: "#f0b352",
  },
  {
    slug: "cyberpunk",
    genre: "Cyberpunk",
    label: "Cyberpunk",
    h1: "Cyberpunk Story Generator",
    title: "Cyberpunk Story Generator — Free, No Login",
    description:
      "Free cyberpunk story generator. Turn any idea into an original neon-noir tale of megacorps, hackers, and chrome in seconds, no sign-up.",
    keywords: [
      "cyberpunk story generator",
      "ai cyberpunk story generator",
      "free cyberpunk story generator",
      "neon noir story generator",
    ],
    lead: "Generate an original cyberpunk story in seconds — neon, megacorps, chrome, and rain. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "From street-level runners to corp intrigue, the cyberpunk story generator nails the noir mood and a sharp twist — great for a cyberpunk RPG one-shot or a quick read.",
    accent: "#c77dff",
  },
  {
    slug: "western",
    genre: "Western",
    label: "Western",
    h1: "Western Story Generator",
    title: "Western Story Generator — Free, No Login",
    description:
      "Free western story generator. Turn any idea into an original frontier tale of dust, grit, and justice in seconds, no sign-up.",
    keywords: [
      "western story generator",
      "ai western story generator",
      "free western story generator",
      "cowboy story generator",
    ],
    lead: "Write an original western in seconds — dust, grit, and frontier justice. Add an idea or let the AI surprise you. No sign-up.",
    blurb:
      "The western story generator delivers lean, atmospheric frontier tales with a real standoff or reckoning — perfect for a weird-west RPG or a quick read.",
    accent: "#e0a86b",
  },
] as const;

export function getStoryGenre(slug: string): StoryGenre | undefined {
  return STORY_GENRES.find((g) => g.slug === slug);
}

// Canonical path for a genre landing page, e.g. genrePath("fantasy") →
// "/story-generators/fantasy". Single source of truth for the genre URL shape.
export function genrePath(slug: string): string {
  return `/story-generators/${slug}`;
}
