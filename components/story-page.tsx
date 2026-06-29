// Shared server-rendered body for every story-generator landing page (the
// head-term /ai-story-generator and the per-genre SEO pages). Owns the hero,
// the FAQ JSON-LD + list, the "from story to campaign" bridge, and internal
// links to the other genre pages. Each page passes its own copy + locked genre.
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { StoryGenerator } from "@/app/ai-story-generator/story-generator";
import { ExamplePrompts } from "@/app/ai-story-generator/example-prompts";
import { STORY_GENRES, genrePath } from "@/lib/story-genres";

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
  illustration?: string; // optional hero background image
  // Optional per-genre body content. When present these render unique sections
  // (subgenres, example prompts, tips) so each genre page has substantial,
  // distinct content rather than a shared template. Absent on a generic page.
  genreLabel?: string; // human label used in the section headings
  subgenres?: string[];
  examplePrompts?: string[];
  tips?: string[];
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
  illustration,
  genreLabel,
  subgenres,
  examplePrompts,
  tips,
}: StoryPageProps) {
  const noun = genreLabel ?? "story";
  const nounLower = noun.toLowerCase();
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

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: h1,
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const otherGenres = STORY_GENRES.filter((g) => g.slug !== currentSlug);

  // Layer (top→bottom): accent glow, dark readability overlay, the illustration.
  const bgLayers = [
    accent &&
      `radial-gradient(circle at 15% -10%, ${accent}22, transparent 38rem)`,
    illustration &&
      "linear-gradient(90deg, var(--bg) 8%, rgba(15,16,32,0.62) 48%, rgba(15,16,32,0.2) 100%)",
    illustration && "linear-gradient(0deg, var(--bg) 1%, transparent 55%)",
    illustration && `url(${illustration}) right center / cover no-repeat`,
  ].filter(Boolean);
  const heroStyle: CSSProperties | undefined = bgLayers.length
    ? { background: bgLayers.join(", ") }
    : undefined;

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
      <section className="hero-band" style={heroStyle}>
        <div className="wrap">
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
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 8 }}>
        <StoryGenerator lockedGenre={lockedGenre} />

        <div style={{ marginTop: 40, maxWidth: 760 }}>
          {intro}

          {subgenres && subgenres.length > 0 && (
            <>
              <h2 style={{ marginTop: 28 }}>{noun} subgenres you can write</h2>
              <p className="lead">
                {noun} is a wide tent. Name one of these in your idea (or set
                the tone to match) and the voice, pacing, and tropes shift to
                suit it:
              </p>
              <div className="chips">
                {subgenres.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}

          {examplePrompts && examplePrompts.length > 0 && (
            <>
              <h2 style={{ marginTop: 28 }}>Example {nounLower} prompts</h2>
              <p className="lead">
                Stuck on a premise? Click any prompt to drop it straight into
                the box above, then tweak the tone or length and generate.
              </p>
              <ExamplePrompts prompts={examplePrompts} />
            </>
          )}

          {tips && tips.length > 0 && (
            <>
              <h2 style={{ marginTop: 28 }}>
                Tips for better {nounLower} stories
              </h2>
              <ul style={{ color: "var(--muted)", lineHeight: 1.8 }}>
                {tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          )}

          <h2 style={{ marginTop: 28 }}>From story to campaign</h2>
          <p className="lead">
            A one-off story is fun, but a world you keep building is better.
            When a story lands, save it — or pull its characters straight out as
            ready-to-run NPCs — into a campaign your tools remember across
            sessions:
          </p>
          <ul style={{ color: "var(--muted)", lineHeight: 1.8 }}>
            <li>
              <Link href="/rpg-tools/npc-generator">NPC Generator</Link> — turn
              a character into a table-ready NPC and save it to a campaign.
            </li>
            <li>
              <Link href="/rpg-tools/character-backstory-generator">
                Character Backstory Generator
              </Link>{" "}
              — give a hero or villain a past that drives the plot.
            </li>
            <li>
              <Link href="/rpg-tools/dnd-name-generator">
                D&amp;D Name Generator
              </Link>{" "}
              and{" "}
              <Link href="/rpg-tools/tavern-name-generator">
                Tavern Name Generator
              </Link>{" "}
              — fast, fitting names for people and places.
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
                <Link href={genrePath(g.slug)}>{g.h1}</Link>
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
          <Link href="/story-generators">← All story generators</Link> ·{" "}
          <Link href="/rpg-tools">RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
