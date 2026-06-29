import type { Metadata } from "next";
import Link from "next/link";
import { SettlementGenerator } from "./settlement-generator";

export const metadata: Metadata = {
  title: "Settlement & Town Generator — Free D&D Towns",
  description:
    "Free settlement and town generator for D&D and tabletop RPGs. Get a town with vibe, notable locations, people to meet, and trouble brewing — by type and setting. No sign-up.",
  keywords: [
    "town generator",
    "settlement generator",
    "dnd town generator",
    "rpg city generator",
  ],
  alternates: { canonical: "/rpg-tools/settlement-generator" },
  openGraph: {
    title: "Settlement & Town Generator — Free D&D Towns",
    description:
      "A town with vibe, notable locations, people to meet, and trouble brewing.",
    type: "website",
  },
};

export default function SettlementGeneratorPage() {
  return (
    <main>
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Settlement Generator · no login
          </div>
          <h1>Settlement &amp; Town Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Conjure a place the party can actually walk into — a hamlet, village,
            town, or city with a distinct vibe, notable locations, people worth
            meeting, and trouble brewing. Built for D&amp;D, Pathfinder, and any
            tabletop RPG.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <SettlementGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the settlement generator works</h2>
          <p className="lead">
            Pick a settlement type, vibe, and setting — or leave them blank — and
            generate a place with three notable locations, two or three NPCs with
            hooks, and a local problem the party can get pulled into. It&apos;s
            specific and system-agnostic, ready to run on the fly. Hit{" "}
            <strong>Regenerate</strong> for a new town.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Bring it to life: name the inn with the{" "}
            <Link href="/rpg-tools/tavern-name-generator">
              Tavern Name Generator
            </Link>
            , flesh out a local with the{" "}
            <Link href="/rpg-tools/npc-generator">NPC Generator</Link>, and save
            it all to a <Link href="/campaigns">campaign</Link>.
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
