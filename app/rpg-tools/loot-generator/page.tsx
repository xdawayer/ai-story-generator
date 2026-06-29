import type { Metadata } from "next";
import Link from "next/link";
import { LootGenerator } from "./loot-generator";

export const metadata: Metadata = {
  title: "Loot Generator — Free D&D Treasure Hoards",
  description:
    "Free loot generator for D&D and tabletop RPGs. Roll a complete treasure hoard — coins, valuables, and notable items with a standout piece — by tier and theme. No sign-up.",
  keywords: [
    "loot generator",
    "dnd loot generator",
    "d&d treasure generator",
    "rpg treasure generator",
  ],
  alternates: { canonical: "/rpg-tools/loot-generator" },
  openGraph: {
    title: "Loot Generator — Free D&D Treasure Hoards",
    description:
      "Roll a full treasure hoard — coins, valuables, and items with a standout piece.",
    type: "website",
  },
};

export default function LootGeneratorPage() {
  return (
    <main>
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Loot Generator · no login
          </div>
          <h1>Loot Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Reward the party with treasure that feels real. Generate a complete
            hoard — coins, valuables, and a few notable items with a standout
            centerpiece — by tier, theme, and party level. Built for D&amp;D,
            Pathfinder, and any tabletop RPG.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <LootGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the loot generator works</h2>
          <p className="lead">
            Pick a tier, theme, setting, and party level — or leave them blank —
            and generate a hoard scaled to the moment. Effects are written in
            plain, system-agnostic terms, and the standout piece comes with a
            story hook so loot pushes the plot, not just the math. Hit{" "}
            <strong>Regenerate</strong> for a fresh haul.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Want a signature reward? Roll a{" "}
            <Link href="/rpg-tools/magic-item-generator">magic item</Link>. Need
            somewhere to hide it? Build a{" "}
            <Link href="/rpg-tools/dungeon-generator">dungeon</Link>.
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
