import type { Metadata } from "next";
import Link from "next/link";
import { QuestHookGenerator } from "./quest-hook-generator";

export const metadata: Metadata = {
  title: "Quest Hook Generator — Free D&D Quest Ideas",
  description:
    "Free quest hook generator for D&D and tabletop RPGs. Get a batch of ready-to-run quest hooks — each a one-or-two-sentence seed with stakes and a twist for your next session. No sign-up.",
  keywords: [
    "quest hook generator",
    "dnd quest generator",
    "rpg quest generator",
    "d&d quest ideas",
  ],
  alternates: { canonical: "/rpg-tools/quest-hook-generator" },
  openGraph: {
    title: "Quest Hook Generator — Free D&D Quest Ideas",
    description:
      "A batch of ready-to-run quest hooks, each a seed for your next session.",
    type: "website",
  },
};

export default function QuestHookGeneratorPage() {
  return (
    <main>
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Quest Hook Generator · no login
          </div>
          <h1>Quest Hook Generator</h1>
          <p className="lead">
            Stuck for what happens next? Generate eight ready-to-run quest hooks
            — each a short seed with a situation, stakes, and a twist you can
            improvise a whole session from. Built for D&amp;D, Pathfinder, and
            any tabletop RPG.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <QuestHookGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the quest hook generator works</h2>
          <p className="lead">
            Pick a setting, quest type, tone, and rough party level — or leave
            them blank and let the AI surprise you. Each hook is written to be
            distinct in shape, not eight variations of &ldquo;go kill the
            monster.&rdquo; Grab one and run it, or generate more.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Ready to go bigger? Turn a hook into a{" "}
            <Link href="/rpg-tools/campaign-plot-generator">
              full campaign plot
            </Link>
            , staff it with an{" "}
            <Link href="/rpg-tools/npc-generator">NPC</Link>, or name the inn the
            party starts in with the{" "}
            <Link href="/rpg-tools/tavern-name-generator">
              Tavern Name Generator
            </Link>
            .
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
