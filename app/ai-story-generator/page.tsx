import type { Metadata } from "next";
import Link from "next/link";
import { StoryGenerator } from "./story-generator";

// SEO flagship: "ai story generator" is a primary head-term funnel into the RPG
// campaign product. Server component so it can export real per-page metadata
// (the client tool lives in ./story-generator.tsx).
export const metadata: Metadata = {
  title: "AI Story Generator — Free, No Login",
  description:
    "Free AI story generator. Turn any idea into an original short story in seconds — pick a genre and tone, no sign-up. Then bring your story into a tabletop campaign.",
  keywords: [
    "ai story generator",
    "free story generator",
    "short story generator",
    "ai story writer",
    "story idea generator",
  ],
  alternates: { canonical: "/ai-story-generator" },
  openGraph: {
    title: "AI Story Generator — Free, No Login",
    description:
      "Turn any idea into an original short story in seconds. Free, no sign-up.",
    type: "website",
  },
};

const FAQ = [
  {
    q: "Is the AI story generator free?",
    a: "Yes. Generating a story is free and needs no account. You can copy the result instantly. Saving stories and characters into a persistent campaign is the optional next step.",
  },
  {
    q: "Who owns the stories I generate?",
    a: "You do. Output is original fiction generated for you. We ask the model to avoid imitating copyrighted franchises, but always review before publishing commercially.",
  },
  {
    q: "How long are the stories?",
    a: "Choose Flash (≈150-250 words), a single Scene, or a Short story (≈400-700 words). Longer, structured long-form is on the roadmap.",
  },
  {
    q: "Can I use it for Dungeons & Dragons or other tabletop RPGs?",
    a: "Absolutely — that's the point. Generate a story, then turn its characters into NPCs and save them to a campaign your other tools remember.",
  },
];

// FAQPage structured data — built from our own FAQ constant (not model output),
// so JSON.stringify into a script tag is XSS-safe. Helps rich results / AI Overview.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function AiStoryGeneratorPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="hero wrap">
        <div className="eyebrow">
          <span className="dot" /> Free AI Story Generator · no login
        </div>
        <h1>AI Story Generator</h1>
        <p className="lead">
          Turn any idea into an original short story in seconds. Pick a genre
          and tone, or leave it blank and let the AI surprise you — no sign-up,
          copy the result instantly.
        </p>

        <StoryGenerator />

        <div style={{ marginTop: 40, maxWidth: 760 }}>
          <h2>How the AI story generator works</h2>
          <p className="lead">
            Describe a premise (or skip it), choose a genre, tone, and length,
            then hit generate. The story streams in as it&apos;s written, so you
            see the opening lines immediately. Don&apos;t like it? Regenerate
            for a fresh take, or tweak your idea and try again.
          </p>

          <h2 style={{ marginTop: 28 }}>From story to campaign</h2>
          <p className="lead">
            A one-off story is fun, but a world you keep building is better. The
            characters, places, and hooks in your story can become reusable
            parts of a tabletop campaign your tools remember across sessions:
          </p>
          <ul style={{ color: "var(--muted)", lineHeight: 1.8 }}>
            <li>
              <Link href="/npc-generator">NPC Generator</Link> — turn a
              character into a table-ready NPC and save it to a campaign.
            </li>
            <li>
              <Link href="/character-backstory">
                Character Backstory Generator
              </Link>{" "}
              — give a hero or villain a past that drives the plot.
            </li>
            <li>
              <Link href="/dnd-name-generator">D&amp;D Name Generator</Link> and{" "}
              <Link href="/tavern-name-generator">Tavern Name Generator</Link> —
              fast, fitting names for people and places.
            </li>
          </ul>

          <h2 style={{ marginTop: 28 }}>Frequently asked questions</h2>
          {FAQ.map((item) => (
            <div key={item.q} style={{ marginTop: 16 }}>
              <h3 style={{ margin: "0 0 6px" }}>{item.q}</h3>
              <p className="lead" style={{ margin: 0 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 32 }}>
          <Link href="/">← All Game Master tools</Link>
        </p>
      </section>

      <footer>
        <div className="wrap">
          Free, no login. Saving stories and characters to a persistent campaign
          is the next step.
        </div>
      </footer>
    </main>
  );
}
