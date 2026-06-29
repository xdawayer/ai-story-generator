import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Library } from "lucide-react";
import { STORY_GENRES, genrePath } from "@/lib/story-genres";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Story Generators by Genre — Free, No Login",
  description:
    "Free AI story generators for every genre — fantasy, sci-fi, horror, mystery, romance, and more. Turn any idea into an original story in seconds, then build it into a campaign. No sign-up.",
  keywords: [
    "story generators",
    "ai story generator by genre",
    "free story generator",
    "ai story generators",
  ],
  alternates: { canonical: "/story-generators" },
  openGraph: {
    title: "AI Story Generators by Genre — Free, No Login",
    description:
      "An original story in any genre in seconds — fantasy, sci-fi, horror, mystery, romance, and more.",
    type: "website",
  },
};

export default function StoryGeneratorsHub() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI story generators by genre",
    itemListElement: STORY_GENRES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.h1,
      url: `${SITE_URL}${genrePath(g.slug)}`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free AI story generators · no login
          </div>
          <h1>AI Story Generators by Genre</h1>
          <p className="lead">
            Pick a genre and turn any idea into an original story in seconds —
            fantasy, sci-fi, horror, mystery, romance, and more. Free, no
            sign-up. Then continue it, save it, or pull its characters into a
            campaign.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <div className="tools-grid">
          <Link className="card" href="/ai-story-generator">
            <h3>
              <BookOpen size={18} /> AI Story Generator{" "}
              <span className="badge">any genre</span>
            </h3>
            <p>
              The all-purpose tool — any idea, any genre, in seconds. Continue
              it, regenerate, or save it to your library.
            </p>
          </Link>
          <Link className="card" href="/long-story-generator">
            <h3>
              <Library size={18} /> Long Story Generator{" "}
              <span className="badge">chapters</span>
            </h3>
            <p>
              Plan a chapter outline, then write a long-form story chapter by
              chapter with continuity kept across chapters.
            </p>
          </Link>
        </div>

        <h2 style={{ marginTop: 36 }}>By genre</h2>
        <div className="tools-grid" style={{ marginTop: 12 }}>
          {STORY_GENRES.map((g) => (
            <Link
              key={g.slug}
              className="card"
              href={genrePath(g.slug)}
              style={{ borderColor: `${g.accent}44` }}
            >
              <h3>
                <span
                  className="dot"
                  style={{ background: g.accent, marginRight: 4 }}
                />{" "}
                {g.h1}
              </h3>
              <p>{g.blurb}</p>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>Running a game?</h2>
          <p className="lead">
            The story tools pair with the{" "}
            <Link href="/rpg-tools">RPG &amp; Game Master tools</Link> — turn a
            story&apos;s characters into saved NPCs, generate a campaign plot, or
            grab a quest hook for your next session.
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/">← Home</Link>
        </p>
      </section>
    </main>
  );
}
