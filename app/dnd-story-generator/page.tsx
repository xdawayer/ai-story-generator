import type { Metadata } from "next";
import { StoryPage, type Faq } from "@/components/story-page";

// Standalone head-term page for "dnd story generator" (a game-system intent, not a
// genre — so it lives at /dnd-story-generator, not under /story-generators/<genre>).
// Reuses the shared StoryPage so it gets the generator, the story-to-campaign
// bridge, and cross-links to every other generator for free.
export const metadata: Metadata = {
  title: "DnD Story Generator — Free D&D Story & Campaign Ideas",
  description:
    "Free DnD story generator. Turn a premise into an original D&D story — a session recap, a character's origin, a tavern legend, or a campaign backstory. No sign-up.",
  keywords: [
    "dnd story generator",
    "d&d story generator",
    "dungeons and dragons story generator",
    "rpg story generator",
  ],
  alternates: { canonical: "/dnd-story-generator" },
  openGraph: {
    title: "DnD Story Generator — Free D&D Story & Campaign Ideas",
    description:
      "Turn a premise into an original D&D story — session recap, character origin, tavern legend, or campaign backstory. Free, no login.",
    type: "website",
  },
};

const EXAMPLE_PROMPTS = [
  "The party's rogue returns to the thieves' guild that raised — and sold — her.",
  "A village hires the adventurers to guard a festival the local god was not invited to.",
  "A paladin's oath breaks the moment it would have saved the wrong person.",
  "The tavern the party drinks in is built over the tomb of the lich they are hunting.",
];

const FAQS: Faq[] = [
  {
    q: "Is the DnD story generator free?",
    a: "Yes — generating is free and needs no account. Copy or download the result instantly; saving it into a campaign is the optional next step.",
  },
  {
    q: "Is it only for D&D 5e?",
    a: "No. The stories are written system-agnostic, so they suit D&D 5e, Pathfinder, OSR, and homebrew worlds — anywhere parties, quests, and dungeons fit.",
  },
  {
    q: "What can I generate?",
    a: "Session recaps, character and villain origins, tavern legends, faction histories, and whole-campaign backstories — any story set in a tabletop-RPG world.",
  },
  {
    q: "How is this different from the AI Story Generator?",
    a: "The AI Story Generator is the all-purpose tool for any genre. The DnD story generator leans into the game's language — parties, factions, gods, dungeons — for stories that drop straight onto your table.",
  },
  {
    q: "Can I use the stories in my campaign or stream?",
    a: "Yes. The output is original fiction generated for you; review it, then use it in your home game, a published adventure, or a stream.",
  },
];

export default function DndStoryGeneratorPage() {
  return (
    <StoryPage
      eyebrow="Free DnD Story Generator · no login"
      h1="DnD Story Generator"
      lead="Turn a premise into an original D&D story — a session recap, a character's origin, a tavern legend, or a whole campaign's backstory. Free, no login, and system-agnostic for D&D 5e, Pathfinder, and beyond."
      currentSlug="dnd-story-generator"
      illustration="/illustrations/hero-fantasy.jpg"
      examplePrompts={EXAMPLE_PROMPTS}
      faqs={FAQS}
      intro={
        <>
          <h2>What is the DnD story generator?</h2>
          <p className="lead">
            The DnD story generator turns an idea into an original story set in a
            Dungeons &amp; Dragons or tabletop-RPG world. It leans into the
            language of the game — parties, quests, factions, gods, and dungeons —
            so the output reads like it belongs at your table, whether you want a
            session recap, a villain&apos;s origin, or a legend the locals tell.
          </p>
          <p className="lead">
            It is free and needs no login. Set a tone and length, drop in a
            premise (or leave it blank), and the story streams in. Hit{" "}
            <strong>Continue</strong> to extend it, <strong>Regenerate</strong>{" "}
            for a new take, or <strong>Download</strong> it as Markdown.
          </p>

          <h2 style={{ marginTop: 28 }}>How to use the DnD story generator</h2>
          <p className="lead">
            Drop in a premise — a character, a place, or a hook — and set the
            genre, tone, and length. Leave the idea blank to let the AI surprise
            you. Generate, then <strong>Continue</strong> to grow it beat by beat,
            or save it to a campaign your tools remember across sessions.
          </p>

          <h2 style={{ marginTop: 28 }}>Who is the DnD story generator for?</h2>
          <ul style={{ color: "var(--muted)", lineHeight: 1.8 }}>
            <li>
              <strong>Game Masters</strong> — write session recaps, NPC origins,
              and the lore your players keep asking about.
            </li>
            <li>
              <strong>Players</strong> — give a character a backstory and the
              small legends that make them feel lived-in.
            </li>
            <li>
              <strong>Worldbuilders</strong> — generate the myths, factions, and
              histories that turn a map into a world.
            </li>
          </ul>
        </>
      }
    />
  );
}
