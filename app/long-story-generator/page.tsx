import type { Metadata } from "next";
import Link from "next/link";
import { LongStoryWriter } from "./long-story-writer";

export const metadata: Metadata = {
  title: "Long Story Generator — Chapters, Free",
  description:
    "Free long story generator. Plan a chapter outline, then write your story chapter by chapter with the AI keeping continuity. No sign-up.",
  keywords: [
    "long story generator",
    "chapter story generator",
    "ai novel generator",
    "long form story generator",
  ],
  alternates: { canonical: "/long-story-generator" },
  openGraph: {
    title: "Long Story Generator — Chapters, Free",
    description:
      "Plan an outline, then write chapter by chapter with continuity kept.",
    type: "website",
  },
};

export default function LongStoryGeneratorPage() {
  return (
    <main>
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Long-form · outline → chapters
          </div>
          <h1>Long Story Generator</h1>
          <p className="lead">
            Plan a chapter outline from your idea, then write the story chapter by
            chapter — the AI keeps continuity across chapters. Free, no sign-up.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <LongStoryWriter />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How it works</h2>
          <p className="lead">
            First generate an outline — a numbered list of chapters, each with a
            one-line beat. Tweak it if you like, then write each chapter in turn.
            Every chapter is grounded in the outline and everything written so
            far, so the story stays coherent. Copy or download the full
            manuscript when you&apos;re done.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Want a quick one-shot instead? Use the{" "}
            <Link href="/ai-story-generator">AI Story Generator</Link>. Building a
            campaign? Turn characters into{" "}
            <Link href="/rpg-tools/npc-generator">NPCs</Link> you save and reuse.
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/">← All Game Master tools</Link>
        </p>
      </section>
    </main>
  );
}
