import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — AI Story Generator for Game Masters",
  description:
    "AI Story Generator is a set of free AI tools for tabletop RPG Game Masters — NPCs, backstories, names, plots, quests, and stories — that funnel into a campaign you keep building.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> About
          </div>
          <h1>Built for Game Masters</h1>
          <p className="lead">
            Fast, free generators for the things you need at the table — that
            grow into a campaign you keep.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 32 }}>
        <div style={{ maxWidth: 760 }}>
          <h2>What this is</h2>
          <p className="lead">
            AI Story Generator is a collection of free AI tools for tabletop
            roleplaying Game Masters. Spin up an{" "}
            <Link href="/rpg-tools/npc-generator">NPC</Link>, a{" "}
            <Link href="/rpg-tools/character-backstory-generator">backstory</Link>
            , a <Link href="/rpg-tools/dnd-name-generator">name</Link>, a{" "}
            <Link href="/rpg-tools/campaign-plot-generator">campaign plot</Link>,
            or a <Link href="/rpg-tools/quest-hook-generator">quest hook</Link> in
            seconds — or generate a full{" "}
            <Link href="/story-generators">story</Link> in any genre.
          </p>

          <h2 style={{ marginTop: 28 }}>The idea</h2>
          <p className="lead">
            The free generators are the front door. The real product is the
            campaign you keep building: save NPCs, factions, locations, plot
            threads, and stories into a{" "}
            <Link href="/campaigns">persistent world</Link> your tools remember
            across sessions, so prep compounds instead of starting from a blank
            page every week.
          </p>

          <h2 style={{ marginTop: 28 }}>How it works</h2>
          <p className="lead">
            Generation is AI-assisted and streams in as it&apos;s written. The
            free tools need no account; saving your world is the optional next
            step. Output is original fiction generated for you — see our{" "}
            <Link href="/terms">terms</Link> and{" "}
            <Link href="/privacy">privacy policy</Link> for the details.
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 28 }}>
          <Link href="/">← Home</Link>
        </p>
      </section>
    </main>
  );
}
