import type { Metadata } from "next";
import Link from "next/link";
import { RandomEncounterGenerator } from "./random-encounter-generator";
import { ToolFaq, type Faq } from "../tool-faq";

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

const FAQS: Faq[] = [
  {
    q: "Is the random encounter generator free?",
    a: "Yes. Generate as many encounters as you like with no account or payment required.",
  },
  {
    q: "What kinds of encounters does it make?",
    a: "Combat, social, and environmental — fights, tense conversations, hazards, and discoveries — each with a situation and a complication so it's more than just “roll initiative.”",
  },
  {
    q: "How many encounters do I get?",
    a: "Six per batch. Hit More encounters for a fresh set.",
  },
  {
    q: "Are they scaled to my party?",
    a: "You set a rough party level to guide difficulty, but encounters are written narratively and system-agnostic, so tune exact numbers for your ruleset.",
  },
  {
    q: "Can I narrow what I get?",
    a: "Yes. Pick a setting, environment, and encounter type, or leave them blank for a wide mix.",
  },
];

export default function RandomEncounterGeneratorPage() {
  return (
    <main>
      <section
        className="hero-band has-art"
        style={
          {
            "--hero-art": "url(/illustrations/hero-horror.jpg)",
          } as React.CSSProperties
        }
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Random Encounter Generator · no login
          </div>
          <h1>Random Encounter Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Need something to happen right now? Generate six ready-to-run
            encounters — fights, social moments, hazards, and discoveries — by
            setting, environment, and party level. Built for D&amp;D,
            Pathfinder, and any tabletop RPG.
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

          <ToolFaq name="Random Encounter Generator" faqs={FAQS} />
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
