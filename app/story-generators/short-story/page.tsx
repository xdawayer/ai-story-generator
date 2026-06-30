import type { Metadata } from "next";
import Link from "next/link";
import { StoryGenerator } from "@/app/ai-story-generator/story-generator";
import { STORY_GENRES, genrePath } from "@/lib/story-genres";

export const metadata: Metadata = {
  title: "Free Short Story Generator — Write a Short Story Online",
  description:
    "Free short story generator. Turn any idea into a complete short story with a real beginning, middle, and end — pick a genre, tone, length, and point of view. No sign-up.",
  keywords: [
    "short story generator",
    "free short story generator",
    "ai short story generator",
    "short story maker",
  ],
  alternates: { canonical: "/story-generators/short-story" },
  openGraph: {
    title: "Free Short Story Generator — Write a Short Story Online",
    description:
      "Turn any idea into a complete short story with a real arc — free, no sign-up.",
    type: "website",
  },
};

const FAQS = [
  {
    q: "Is the short story generator free?",
    a: "Yes. Generating a short story is free and needs no account. Copy or download the result instantly.",
  },
  {
    q: "How long is a generated short story?",
    a: "Pick Flash (≈150–250 words), a single Scene (≈300–500 words), or a Short story (≈400–700 words). Use Continue to extend it beat by beat.",
  },
  {
    q: "Can I choose the genre and point of view?",
    a: "Yes — set genre, tone, length, and POV, and add optional characters, setting, and an ending style in the Optional details panel.",
  },
  {
    q: "Who owns the short stories I create?",
    a: "You do. Output is original fiction generated for you. Review before publishing commercially.",
  },
];

export default function ShortStoryGeneratorPage() {
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
    name: "Free Short Story Generator",
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
            <span className="dot" /> Free Short Story Generator · no login
          </div>
          <h1>Free Short Story Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Turn any idea into a complete short story — a real beginning,
            middle, and end — in seconds. Choose a genre, tone, length, and
            point of view, or leave it blank and let the AI surprise you.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28 }}>
        <StoryGenerator />
      </section>

      <div className="wrap">
        <section className="section">
          <h2>What this short story generator can do</h2>
          <p className="lead" style={{ maxWidth: 760 }}>
            Every story streams in as it&apos;s written, with a clear arc and
            real characters — not generic filler. Set the length to{" "}
            <strong>Flash</strong> for a punchy micro-story,{" "}
            <strong>Scene</strong> for a single vivid moment, or{" "}
            <strong>Short</strong> for a full short story. Hit{" "}
            <strong>Continue</strong> to extend it, <strong>Regenerate</strong>{" "}
            for a new take, or <strong>Download</strong> it as Markdown.
          </p>
          <p className="lead" style={{ marginTop: 14, fontSize: 14 }}>
            Want more control or a longer piece? Use the broad{" "}
            <Link href="/">AI Story Generator</Link>, write chapter by chapter
            with the{" "}
            <Link href="/long-story-generator">Long Story Generator</Link>, or
            grab a starting idea from the{" "}
            <Link href="/story-generators/prompts">Story Prompt Generator</Link>
            .
          </p>
        </section>

        <section className="section">
          <h2>Example short story ideas</h2>
          <p className="lead">
            Stuck on a premise? Drop one of these into the box above, set a
            length, and generate:
          </p>
          <ul style={{ color: "var(--muted)", lineHeight: 1.8, maxWidth: 760 }}>
            <li>
              A locksmith is hired to open a box she made — and does not
              remember making.
            </li>
            <li>
              On the last day of summer, a child trades their shadow for one
              more afternoon.
            </li>
            <li>
              Two strangers keep meeting in the same recurring dream and decide
              to test it.
            </li>
          </ul>
        </section>

        <section className="section">
          <h2>Who is the short story generator for?</h2>
          <ul style={{ color: "var(--muted)", lineHeight: 1.8, maxWidth: 760 }}>
            <li>
              <strong>Writers and students</strong> — beat the blank page with a
              complete story you can edit, expand, or learn from.
            </li>
            <li>
              <strong>Hobbyists and readers</strong> — generate a quick,
              self-contained story to read in one sitting.
            </li>
            <li>
              <strong>Game Masters</strong> — spin a one-shot tale or a piece of
              in-world fiction for your table.
            </li>
          </ul>
        </section>

        <section className="section">
          <h2>Short stories by genre</h2>
          <p className="lead">
            Prefer a page tuned to one genre? Each has its own short story
            generator with matched tone and tropes:
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
