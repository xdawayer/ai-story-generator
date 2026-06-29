import type { Metadata } from "next";
import Link from "next/link";
import { RandomEncounterGenerator } from "./random-encounter-generator";

export const metadata: Metadata = {
  title: "Random Encounter Generator — Free D&D Encounters",
  description:
    "Free random encounter generator for D&D and tabletop RPGs. Get a batch of combat, social, and environmental encounters by setting and party level — each with a twist. No sign-up.",
  keywords: [
    "random encounter generator",
    "dnd encounter generator",
    "d&d random encounter generator",
    "rpg encounter generator",
  ],
  alternates: { canonical: "/rpg-tools/random-encounter-generator" },
  openGraph: {
    title: "Random Encounter Generator — Free D&D Encounters",
    description:
      "A batch of combat, social, and environmental encounters, each with a twist to run with.",
    type: "website",
  },
};

export default function RandomEncounterGeneratorPage() {
  return (
    <main>
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Random Encounter Generator · no login
          </div>
          <h1>Random Encounter Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Need something to happen right now? Generate six ready-to-run
            encounters — fights, social moments, hazards, and discoveries — by
            setting, environment, and party level. Built for D&amp;D, Pathfinder,
            and any tabletop RPG.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <RandomEncounterGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the random encounter generator works</h2>
          <p className="lead">
            Pick a setting, environment, encounter type, and rough party level —
            or leave them blank for a wide mix — and generate a batch. Each
            encounter is written to be distinct, with a situation and a
            complication, so it&apos;s not just &ldquo;roll initiative.&rdquo;
            Hit <strong>More encounters</strong> for another set.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Turn one into a session: grab a{" "}
            <Link href="/rpg-tools/quest-hook-generator">quest hook</Link>, hand
            out loot from the{" "}
            <Link href="/rpg-tools/magic-item-generator">
              Magic Item Generator
            </Link>
            , or staff it with an{" "}
            <Link href="/rpg-tools/npc-generator">NPC</Link>.
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
