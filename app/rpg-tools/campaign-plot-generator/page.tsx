import type { Metadata } from "next";
import Link from "next/link";
import { CampaignPlotGenerator } from "./campaign-plot-generator";

export const metadata: Metadata = {
  title: "Campaign Plot Generator — Free D&D Campaign Ideas",
  description:
    "Free campaign plot generator for D&D and tabletop RPGs. Turn a one-line idea into a runnable campaign skeleton — premise, villain, three acts, a twist, and a climax. No sign-up.",
  keywords: [
    "campaign plot generator",
    "dnd campaign generator",
    "rpg campaign generator",
    "d&d campaign ideas",
  ],
  alternates: { canonical: "/rpg-tools/campaign-plot-generator" },
  openGraph: {
    title: "Campaign Plot Generator — Free D&D Campaign Ideas",
    description:
      "Turn a one-line idea into a runnable campaign skeleton — premise, villain, acts, twist, climax.",
    type: "website",
  },
};

export default function CampaignPlotGeneratorPage() {
  return (
    <main>
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Campaign Plot Generator · no login
          </div>
          <h1>Campaign Plot Generator</h1>
          <p className="lead">
            Turn a single idea into a campaign you can actually run — a premise,
            a credible villain, a three-act arc with beats, a real mid-campaign
            twist, and a climax. Built for D&amp;D, Pathfinder, and any tabletop
            RPG.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <CampaignPlotGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the campaign plot generator works</h2>
          <p className="lead">
            Drop in a seed idea or leave it blank, pick a setting, tone, and rough
            number of acts, then generate. You get a structured skeleton — premise,
            villain, acts with beats, a twist, a climax, and loose threads to pull
            on — not vague filler. Tweak any section and regenerate until it fits
            your table.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Need session-level ideas instead? Grab a{" "}
            <Link href="/rpg-tools/quest-hook-generator">quest hook</Link>. Then
            populate the world with an{" "}
            <Link href="/rpg-tools/npc-generator">NPC</Link> and save everything
            into a <Link href="/campaigns">persistent campaign</Link> your tools
            remember across sessions.
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
