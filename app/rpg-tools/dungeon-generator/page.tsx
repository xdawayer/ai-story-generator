import type { Metadata } from "next";
import Link from "next/link";
import { DungeonGenerator } from "./dungeon-generator";
import { ToolFaq, type Faq } from "../tool-faq";

export const metadata: Metadata = {
  title: "Dungeon Generator — Free D&D Dungeons",
  description:
    "Free dungeon generator for D&D and tabletop RPGs. Get a runnable dungeon — premise, room-by-room walkthrough, boss, treasure, and a hook — by type and size. No sign-up.",
  keywords: [
    "dungeon generator",
    "dnd dungeon generator",
    "d&d dungeon generator",
    "random dungeon generator",
  ],
  alternates: { canonical: "/rpg-tools/dungeon-generator" },
  openGraph: {
    title: "Dungeon Generator — Free D&D Dungeons",
    description:
      "A runnable dungeon — premise, rooms, boss, treasure, and a hook — in seconds.",
    type: "website",
  },
};

const FAQS: Faq[] = [
  {
    q: "Is the dungeon generator free?",
    a: "Yes. Generate as many dungeons as you like with no account or payment required.",
  },
  {
    q: "What does a generated dungeon include?",
    a: "A premise, a room-by-room walkthrough that varies between fights, puzzles, hazards, and discoveries, a boss with a motive, treasure, and a hook to what comes next.",
  },
  {
    q: "Can I control the size and type?",
    a: "Yes. Choose a dungeon type, size, setting, and party level, or leave them blank and let the generator surprise you.",
  },
  {
    q: "Does it work for systems other than D&D?",
    a: "Yes. The output is system-agnostic — no edition-specific stat blocks — so it runs in Pathfinder, OSR, or any tabletop RPG.",
  },
  {
    q: "How do I stock it with loot and monsters?",
    a: "Pair it with the loot generator for treasure, the random encounter generator for what roams the halls, and the NPC generator for whoever lurks inside.",
  },
];

export default function DungeonGeneratorPage() {
  return (
    <main>
      <section
        className="hero-band has-art"
        style={
          {
            "--hero-art": "url(/illustrations/hero-dungeon.jpg)",
          } as React.CSSProperties
        }
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Dungeon Generator · no login
          </div>
          <h1>Dungeon Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Drop a dungeon onto the table in seconds — a premise, a room-by-room
            walkthrough, a boss, treasure, and a hook to what&apos;s next. Pick
            a type, size, and party level, or let the AI surprise you. Built for
            D&amp;D, Pathfinder, and any tabletop RPG.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <DungeonGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the dungeon generator works</h2>
          <p className="lead">
            Choose a dungeon type, size, setting, and party level — or leave
            them blank — and generate a complete crawl. Rooms vary between
            fights, puzzles, hazards, and discoveries, and the boss has a
            motive, not just hit points. Everything is system-agnostic, so it
            runs in any ruleset. Hit <strong>Regenerate</strong> for a new
            layout.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Fill it out: add a{" "}
            <Link href="/rpg-tools/loot-generator">treasure hoard</Link>, a{" "}
            <Link href="/rpg-tools/random-encounter-generator">
              random encounter
            </Link>
            , or the <Link href="/rpg-tools/npc-generator">NPC</Link> who lurks
            inside.
          </p>

          <ToolFaq name="Dungeon Generator" faqs={FAQS} />
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
