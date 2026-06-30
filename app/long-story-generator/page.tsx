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

const FAQS = [
  {
    q: "Is the long story generator free?",
    a: "Yes — planning an outline and writing chapters is free with no account. Copy or download the full manuscript when you're done.",
  },
  {
    q: "How long can the story get?",
    a: "As long as your outline. Generate a chapter list, then write each chapter in turn — there is no hard cap, and continuity is kept across chapters.",
  },
  {
    q: "Does it keep continuity between chapters?",
    a: "Yes. Each chapter is grounded in the outline and everything written so far, so names, threads, and tone stay consistent from start to finish.",
  },
  {
    q: "Can I edit the outline before writing?",
    a: "Yes. The outline is a numbered list of chapter beats you can tweak before you start, so the story goes where you want it to.",
  },
  {
    q: "Who owns the story I write?",
    a: "You do. The output is original fiction generated for you; review it before publishing or selling it.",
  },
];

export default function LongStoryGeneratorPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Long Story Generator",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Long-form · outline → chapters
          </div>
          <h1>Long Story Generator</h1>
          <p className="lead">
            Plan a chapter outline from your idea, then write the story chapter
            by chapter — the AI keeps continuity across chapters. Free, no
            sign-up.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <LongStoryWriter />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>What is the long story generator?</h2>
          <p className="lead">
            The long story generator writes long-form fiction in two steps:
            first it plans a chapter outline from your idea, then it writes each
            chapter in turn while keeping continuity across the whole piece. It
            is built for novellas, serials, and multi-chapter stories a one-shot
            generator can&apos;t hold together.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            It is free and needs no login. Edit the outline before you start,
            write chapters one at a time, and copy or download the finished
            manuscript as Markdown.
          </p>

          <h2 style={{ marginTop: 28 }}>How it works</h2>
          <p className="lead">
            First generate an outline — a numbered list of chapters, each with a
            one-line beat. Tweak it if you like, then write each chapter in turn.
            Every chapter is grounded in the outline and everything written so
            far, so the story stays coherent. Copy or download the full
            manuscript when you&apos;re done.
          </p>

          <h2 style={{ marginTop: 28 }}>What you can write</h2>
          <ul style={{ color: "var(--muted)", lineHeight: 1.8 }}>
            <li>A multi-chapter fantasy novella from a single premise.</li>
            <li>
              A serialized mystery where each chapter ends on a fresh clue.
            </li>
            <li>
              A character&apos;s full origin arc, chapter by chapter, for a
              campaign.
            </li>
          </ul>

          <h2 style={{ marginTop: 28 }}>Who is the long story generator for?</h2>
          <ul style={{ color: "var(--muted)", lineHeight: 1.8 }}>
            <li>
              <strong>Novelists and serial writers</strong> — draft a long piece
              with a structure instead of a blank document.
            </li>
            <li>
              <strong>Worldbuilders and Game Masters</strong> — write the
              multi-chapter history or saga behind your setting.
            </li>
            <li>
              <strong>Writers who stall on structure</strong> — get an outline
              first, so every chapter has a job to do.
            </li>
          </ul>

          <p className="lead" style={{ marginTop: 16, fontSize: 14 }}>
            Want a quick one-shot instead? Use the{" "}
            <Link href="/">AI Story Generator</Link>. Building a campaign? Turn
            characters into <Link href="/rpg-tools/npc-generator">NPCs</Link> you
            save and reuse.
          </p>

          <h2 style={{ marginTop: 28 }}>Frequently asked questions</h2>
          {FAQS.map((f) => (
            <div key={f.q} style={{ marginTop: 16 }}>
              <h3 style={{ margin: "0 0 6px" }}>{f.q}</h3>
              <p className="lead" style={{ margin: 0 }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/story-generators">← All story generators</Link>
        </p>
      </section>
    </main>
  );
}
