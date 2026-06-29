// Shared server-rendered body for every story-generator landing page (the
// head-term /ai-story-generator and the per-genre SEO pages). Owns the hero,
// the FAQ JSON-LD + list, the "from story to campaign" bridge, and internal
// links to the other genre pages. Each page passes its own copy + locked genre.
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { StoryGenerator } from "@/app/ai-story-generator/story-generator";
import { STORY_GENRES } from "@/lib/story-genres";

export interface Faq {
  q: string;
  a: string;
}

export interface StoryPageProps {
  eyebrow: string;
  h1: string;
  lead: string;
  lockedGenre?: string;
  intro: ReactNode; // page-specific prose under the generator
  faqs: Faq[];
  currentSlug?: string; // omit this genre from the "more generators" list
  accent?: string; // per-genre theme color
}

export function StoryPage({
  eyebrow,
  h1,
  lead,
  lockedGenre,
  intro,
  faqs,
  currentSlug,
  accent,
}: StoryPageProps) {
  // FAQPage structured data — built from our own constant (not model output),
  // so JSON.stringify into a script tag is XSS-safe.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const otherGenres = STORY_GENRES.filter((g) => g.slug !== currentSlug);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section
        className="hero wrap"
        style={
          accent
            ? ({
                background: `radial-gradient(circle at 15% -10%, ${accent}22, transparent 38rem)`,
              } as CSSProperties)
            : undefined
        }
      >
        <div
          className="eyebrow"
          style={accent ? { borderColor: `${accent}66` } : undefined}
        >
          <span
            className="dot"
            style={accent ? { background: accent } : undefined}
          />{" "}
          {eyebrow}
        </div>
        <h1>{h1}</h1>
        <p className="lead">{lead}</p>

        <StoryGenerator lockedGenre={lockedGenre} />

        <div style={{ marginTop: 40, maxWidth: 760 }}>
          {intro}

          <h2 style={{ marginTop: 28 }}>From story to campaign</h2>
          <p className="lead">
            A one-off story is fun, but a world you keep building is better.
            When a story lands, save it — or pull its characters straight out as
            ready-to-run NPCs — into a campaign your tools remember across
            sessions:
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
            <li>
              <Link href="/campaigns">Your campaigns</Link> and{" "}
              <Link href="/stories">your saved stories</Link> — everything you
              keep, in one place.
            </li>
          </ul>

          <h2 style={{ marginTop: 28 }}>More story generators</h2>
          <ul style={{ color: "var(--muted)", lineHeight: 1.8 }}>
            {currentSlug && (
              <li>
                <Link href="/ai-story-generator">AI Story Generator</Link> — any
                genre.
              </li>
            )}
            {otherGenres.map((g) => (
              <li key={g.slug}>
                <Link href={`/${g.slug}`}>{g.h1}</Link>
              </li>
            ))}
          </ul>

          <h2 style={{ marginTop: 28 }}>Frequently asked questions</h2>
          {faqs.map((item) => (
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
