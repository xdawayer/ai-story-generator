import type { Metadata } from "next";
import Link from "next/link";
import { MagicItemGenerator } from "./magic-item-generator";

export const metadata: Metadata = {
  title: "Magic Item Generator — Free D&D Magic Items",
  description:
    "Free magic item generator for D&D and tabletop RPGs. Get original magic items with a name, rarity, type, effect, and a hook — ready to hand out as loot. No sign-up.",
  keywords: [
    "magic item generator",
    "dnd magic item generator",
    "d&d magic item generator",
    "rpg magic item generator",
  ],
  alternates: { canonical: "/rpg-tools/magic-item-generator" },
  openGraph: {
    title: "Magic Item Generator — Free D&D Magic Items",
    description:
      "Original magic items with a name, rarity, type, effect, and a hook — ready as loot.",
    type: "website",
  },
};

export default function MagicItemGeneratorPage() {
  return (
    <main>
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Magic Item Generator · no login
          </div>
          <h1>Magic Item Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Reward your party with loot worth remembering. Generate five original
            magic items — each with a name, rarity, type, a plain-language
            effect, and a story hook. Built for D&amp;D, Pathfinder, and any
            tabletop RPG.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <MagicItemGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the magic item generator works</h2>
          <p className="lead">
            Choose a rarity, item type, theme, and setting — or leave them blank
            for a wide mix — and generate a batch. Effects are written in plain,
            system-agnostic terms so they drop into any ruleset, and every item
            comes with a touch of story instead of a bare &ldquo;+1.&rdquo; Hit{" "}
            <strong>More items</strong> for another set.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Place it in the world: hand it out after a{" "}
            <Link href="/rpg-tools/random-encounter-generator">
              random encounter
            </Link>
            , or build the{" "}
            <Link href="/rpg-tools/npc-generator">NPC</Link> who guards it and
            save it all to a <Link href="/campaigns">campaign</Link>.
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
