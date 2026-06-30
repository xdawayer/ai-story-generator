import type { Metadata } from "next";
import Link from "next/link";
import { STORY_GENRES, genrePath, getStoryGenre } from "@/lib/story-genres";
import { rpgToolPath, getRpgTool } from "@/lib/rpg-tools";
import { SITE_URL } from "@/lib/site";
import {
  featuredTools,
  genreExtras,
  genreGroups,
  faqItems,
} from "@/lib/story-generator-data";

export const metadata: Metadata = {
  title: "AI Story Generators by Genre — Free Story Writing Tools",
  description:
    "Free AI story generators for every genre — fantasy, sci-fi, horror, mystery, romance, and more. Browse genre-specific tools and long, short, and prompt generators, then turn a story into a campaign. No sign-up.",
  keywords: [
    "story generators",
    "ai story generator by genre",
    "free story generator",
    "ai story generators",
  ],
  alternates: { canonical: "/story-generators" },
  openGraph: {
    title: "AI Story Generators by Genre — Free Story Writing Tools",
    description:
      "An original story in any genre in seconds — fantasy, sci-fi, horror, mystery, romance, and more. Free, no login.",
    type: "website",
  },
};

// The story-to-campaign loop steps. Body links point to crawlable SEO targets;
// /campaigns is intentionally NOT used here (it is a dynamic workspace, a
// secondary "save your work" CTA rendered separately below).
const CAMPAIGN_STEPS = [
  {
    n: 1,
    title: "Generate a story",
    body: "Start with any genre generator and get an original story with real characters in seconds.",
  },
  {
    n: 2,
    title: "Pull out the cast",
    body: "Turn the people in your story into reusable, table-ready characters.",
  },
  {
    n: 3,
    title: "Build the world",
    body: "Spin up a plot and the hooks that connect your cast into a living campaign.",
  },
  {
    n: 4,
    title: "Keep it",
    body: "Save everything into a campaign your tools remember from one session to the next.",
  },
];

export default function StoryGeneratorsHub() {
  // Single source for the genre cards: flatten the display groups, resolve each
  // slug against STORY_GENRES. This is both what renders AND what the ItemList
  // JSON-LD advertises, so structured data can never drift from the page.
  const visibleGenres = genreGroups.flatMap((group) =>
    group.slugs
      .map((slug) => getStoryGenre(slug))
      .filter((g): g is (typeof STORY_GENRES)[number] => Boolean(g)),
  );

  const pageUrl = `${SITE_URL}/story-generators`;
  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: `${SITE_URL}/`,
        name: "AI Story Generator",
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: "AI Story Generators by Genre",
        description:
          "Free AI story generators for every genre, plus long, short, and prompt tools — and the path from a story to a saved campaign.",
        isPartOf: { "@id": `${SITE_URL}#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Story Generators",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: "AI story generators by genre",
        itemListElement: visibleGenres.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.h1,
          url: `${SITE_URL}${genrePath(g.slug)}`,
        })),
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />

      {/* 1. Hero */}
      <section
        className="hero-band has-art"
        style={
          {
            "--hero-art": "url(/illustrations/hero-story-generators.jpg)",
          } as React.CSSProperties
        }
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free AI story generators · no login
          </div>
          <h1>AI Story Generators by Genre</h1>
          <p className="lead">
            Every genre, one place — fantasy, sci-fi, horror, mystery, romance,
            and more. Pick a generator and turn any idea into an original story
            in seconds. Free, no sign-up. Then continue it, save it, or pull its
            characters into a campaign.
          </p>
          <p className="lead" style={{ marginTop: 16, fontSize: 15 }}>
            <Link href="/">Start with any genre →</Link>
            <span style={{ margin: "0 12px", opacity: 0.5 }}>·</span>
            <Link href="#by-genre">Browse by genre ↓</Link>
          </p>
        </div>
      </section>

      <div className="wrap">
        {/* 2. Featured story tools */}
        <section className="section">
          <h2>Featured story tools</h2>
          <p className="lead">
            Four ways to write — pick the shape that fits what you need.
          </p>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {featuredTools.map((tool) => (
              <Link key={tool.href} className="card" href={tool.href}>
                <h3>
                  {tool.name}
                  {tool.badge ? (
                    <>
                      {" "}
                      <span className="badge">{tool.badge}</span>
                    </>
                  ) : null}
                </h3>
                <p>{tool.desc}</p>
                <p className="example-meta" style={{ marginTop: 10 }}>
                  {tool.bestFor}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. From story to campaign (the differentiator) */}
        <section className="section">
          <h2>From story to campaign</h2>
          <p className="lead" style={{ maxWidth: 760 }}>
            These generators aren&apos;t one-and-done. Generate a story, pull
            its cast out as NPCs, and grow them into a plot your tools remember
            from one session to the next. Prep compounds instead of starting
            from a blank page every week — that&apos;s what the{" "}
            <Link href="/rpg-tools">RPG &amp; Game Master tools</Link> are for.
          </p>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {CAMPAIGN_STEPS.map((s) => (
              <div key={s.n} className="card" style={{ cursor: "default" }}>
                <span className="step-num">{s.n}</span>
                <h3 style={{ margin: "0 0 6px" }}>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
          <p className="lead" style={{ marginTop: 18, maxWidth: 760 }}>
            Jump straight to the{" "}
            <Link href={rpgToolPath("npc-generator")}>NPC Generator</Link>, the{" "}
            <Link href={rpgToolPath("campaign-plot-generator")}>
              Campaign Plot Generator
            </Link>
            , or the{" "}
            <Link href={rpgToolPath("quest-hook-generator")}>
              Quest Hook Generator
            </Link>{" "}
            — all free, no login.
          </p>
          <p className="lead" style={{ marginTop: 12, fontSize: 14 }}>
            <Link href="/campaigns">Save your work to a campaign →</Link>
          </p>
        </section>

        {/* 4. Browse by genre */}
        <section className="section" id="by-genre">
          <h2>Browse by genre</h2>
          <p className="lead">
            Each genre has a dedicated generator tuned to its mood, tropes, and
            structure. Pick one and start writing.
          </p>
          {genreGroups.map((group) => (
            <div key={group.title} style={{ marginTop: 24 }}>
              <h3 style={{ margin: "0 0 12px" }}>{group.title}</h3>
              <div className="tools-grid">
                {group.slugs.map((slug) => {
                  const g = getStoryGenre(slug);
                  if (!g) return null;
                  const extra = genreExtras[slug];
                  const related = extra?.relatedRpgToolSlug
                    ? getRpgTool(extra.relatedRpgToolSlug)
                    : undefined;
                  return (
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
                      {extra?.bestFor ? (
                        <p className="example-meta" style={{ marginTop: 10 }}>
                          {extra.bestFor}
                        </p>
                      ) : null}
                      {extra?.examplePrompt ? (
                        <p
                          className="example-out"
                          style={{ marginTop: 8, fontSize: 14 }}
                        >
                          “{extra.examplePrompt}”
                        </p>
                      ) : null}
                      {related ? (
                        <p style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                          Pairs with the {related.name}
                        </p>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* 5. SEO text block */}
        <section className="section">
          <h2>What is an AI story generator?</h2>
          <p className="lead" style={{ maxWidth: 820 }}>
            An AI story generator turns a short premise — or nothing at all —
            into an original, readable story in seconds. You set the genre,
            tone, and length, and the model writes a complete arc with real
            characters rather than generic filler. The{" "}
            <Link href="/">AI Story Generator</Link> is the
            all-purpose version; the{" "}
            <Link href="/long-story-generator">Long Story Generator</Link>{" "}
            writes multi-chapter work, and the{" "}
            <Link href="/story-generators/short-story">
              Short Story Generator
            </Link>{" "}
            produces a single self-contained tale. Out of ideas? The{" "}
            <Link href="/story-generators/prompts">Story Prompt Generator</Link>{" "}
            hands you ten to choose from.
          </p>

          <h2 style={{ marginTop: 28 }}>
            Why use a genre-specific story generator?
          </h2>
          <p className="lead" style={{ maxWidth: 820 }}>
            A genre-tuned generator knows the tropes, pacing, and atmosphere
            readers expect, so the output lands instead of feeling generic. The{" "}
            <Link href={genrePath("fantasy")}>Fantasy Story Generator</Link>{" "}
            leans into magic and quests, the{" "}
            <Link href={genrePath("horror")}>Horror Story Generator</Link>{" "}
            builds dread and a real twist, and the{" "}
            <Link href={genrePath("mystery")}>Mystery Story Generator</Link>{" "}
            plots clues and misdirection. Browsing{" "}
            <Link href="#by-genre">by genre</Link> is the fastest way to a story
            that already sounds right for what you&apos;re making.
          </p>

          <h2 style={{ marginTop: 28 }}>
            For writers, Game Masters, teachers, and worldbuilders
          </h2>
          <p className="lead" style={{ maxWidth: 820 }}>
            Writers use these tools to beat the blank page and draft fast. Game
            Masters generate a story, then turn its cast into NPCs with the{" "}
            <Link href={rpgToolPath("npc-generator")}>NPC Generator</Link> and a
            session arc with the{" "}
            <Link href={rpgToolPath("campaign-plot-generator")}>
              Campaign Plot Generator
            </Link>
            . Teachers spin up reading and writing examples, and worldbuilders
            grow legends and lore. Whatever you make, the{" "}
            <Link href="/rpg-tools">RPG &amp; Game Master tools</Link> let it
            compound into a saved world.
          </p>
        </section>

        {/* 6. FAQ */}
        <section className="section" style={{ paddingBottom: 16 }}>
          <h2>Frequently asked questions</h2>
          {faqItems.map((f) => (
            <div key={f.question} style={{ marginTop: 18, maxWidth: 820 }}>
              <h3 style={{ margin: "0 0 6px" }}>{f.question}</h3>
              <p className="lead" style={{ margin: 0 }}>
                {f.answer}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
