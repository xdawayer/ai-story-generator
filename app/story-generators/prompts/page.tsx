import type { Metadata } from "next";
import Link from "next/link";
import { PromptsGenerator } from "./prompts-generator";
import { STORY_GENRES, genrePath } from "@/lib/story-genres";

export const metadata: Metadata = {
  title: "Story Prompt Generator — Free Writing Prompts",
  description:
    "Free story prompt generator. Get 10 original writing prompts by genre, tone, and audience to beat writer's block — then turn any one into a full story. No sign-up.",
  keywords: [
    "story prompt generator",
    "writing prompt generator",
    "random story prompt generator",
    "creative writing prompts",
  ],
  alternates: { canonical: "/story-generators/prompts" },
  openGraph: {
    title: "Story Prompt Generator — Free Writing Prompts",
    description:
      "10 original writing prompts by genre, tone, and audience — then turn one into a full story.",
    type: "website",
  },
};

const FAQS = [
  {
    q: "Is the story prompt generator free?",
    a: "Yes. Generate as many batches of prompts as you like, free and with no account. Copy any prompt and run with it.",
  },
  {
    q: "What kinds of prompts can it make?",
    a: "Pick a genre, tone, audience, and style — what-if scenarios, character-driven setups, evocative first lines, settings, or dialogue starters.",
  },
  {
    q: "Can I turn a prompt into a full story?",
    a: "Yes — copy a prompt into the AI Story Generator and it writes the whole story, in the genre, tone, length, and point of view you choose.",
  },
  {
    q: "Are the prompts original?",
    a: "Each batch is generated fresh for you. They're original starting points — where you take them is yours.",
  },
];

export default function StoryPromptGeneratorPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Story Prompt Generator · no login
          </div>
          <h1>Story Prompt Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Beat the blank page. Generate ten original writing prompts by genre,
            tone, and audience — then take any one and run. Great for daily
            writing practice, classrooms, and warm-ups.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28 }}>
        <PromptsGenerator />
      </section>

      <div className="wrap">
        <section className="section">
          <h2>How the story prompt generator works</h2>
          <p className="lead" style={{ maxWidth: 760 }}>
            Choose a genre, tone, audience, and prompt style — or leave them
            blank for a wide mix — and generate a fresh batch of ten. Each prompt
            sets up a character, a situation, and an implied tension, so you have
            somewhere real to start. Hit <strong>More prompts</strong> for
            another batch.
          </p>
          <p className="lead" style={{ marginTop: 14, fontSize: 14 }}>
            Ready to write? Drop a prompt into the{" "}
            <Link href="/ai-story-generator">AI Story Generator</Link>, or write
            it long-form with the{" "}
            <Link href="/long-story-generator">Long Story Generator</Link>.
          </p>
        </section>

        <section className="section">
          <h2>Prompts by genre</h2>
          <p className="lead">
            Want prompts and stories tuned to one genre? Each has its own
            generator:
          </p>
          <div className="chips">
            {STORY_GENRES.map((g) => (
              <Link key={g.slug} className="chip" href={genrePath(g.slug)}>
                {g.h1}
              </Link>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingBottom: 16 }}>
          <h2>Frequently asked questions</h2>
          {FAQS.map((f) => (
            <div key={f.q} style={{ marginTop: 18, maxWidth: 820 }}>
              <h3 style={{ margin: "0 0 6px" }}>{f.q}</h3>
              <p className="lead" style={{ margin: 0 }}>
                {f.a}
              </p>
            </div>
          ))}
        </section>

        <p className="lead" style={{ fontSize: 14, paddingBottom: 8 }}>
          <Link href="/story-generators">← All story generators</Link>
        </p>
      </div>
    </main>
  );
}
