import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TrackedLink } from "@/components/home-tracked-link";
import { StoryGenerator } from "@/app/ai-story-generator/story-generator";
import {
  EXAMPLE_OUTPUTS,
  WHY_CARDS,
  HOME_FAQ,
  STORY_DIRECTORY,
  RPG_DIRECTORY,
  RPG_SYSTEMS,
} from "@/lib/home-data";
import { genrePath } from "@/lib/story-genres";
import { rpgToolPath } from "@/lib/rpg-tools";

export const metadata: Metadata = {
  title: "AI Story Generator — Free AI Stories + D&D & RPG Tools",
  description:
    "Free AI story generator: turn any idea into an original story with custom genre, tone, length, and POV. Plus RPG tools for Game Masters — NPCs, campaign openings, quest hooks, backstories, and D&D names. No login.",
  keywords: [
    "ai story generator",
    "free ai story generator",
    "short story generator",
    "ai story writer",
    "ai story generator for dnd",
    "rpg story generator",
    "game master story generator",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI Story Generator — Free AI Stories + D&D & RPG Tools",
    description:
      "Free AI story generator with custom genre, tone, length, and POV — plus RPG tools for Game Masters: NPCs, quest hooks, backstories, and D&D names. No login.",
    url: "/",
    siteName: "AI Story Generator",
    type: "website",
  },
};

// Section 3 — the story → campaign workflow, productized as four steps.
const WORKFLOW = [
  {
    n: 1,
    title: "Generate a story",
    body: "Start from a rough idea and get a finished, original story in seconds.",
  },
  {
    n: 2,
    title: "Extract story elements",
    body: "Pull the cast, places, and threads out of the prose with one click.",
  },
  {
    n: 3,
    title: "Create RPG assets",
    body: "Turn those elements into table-ready NPCs, quest hooks, and plots.",
  },
  {
    n: 4,
    title: "Save to campaign memory",
    body: "Keep everything in a campaign your tools remember session to session.",
  },
];

// Section 8 — how it works. Step 4 leads on EXTRACT, the differentiator.
const HOW_IT_WORKS = [
  {
    n: 1,
    title: "Choose a generator",
    body: "Pick a story generator or an RPG tool — stories, NPCs, plots, names, and more.",
  },
  {
    n: 2,
    title: "Add a premise",
    body: "Drop in an idea and set genre, tone, and length — or leave it blank and let the AI surprise you.",
  },
  {
    n: 3,
    title: "Generate",
    body: "Your result streams in as it's written. No login required to generate.",
  },
  {
    n: 4,
    title: "Continue, rewrite, extract, or save",
    body: "Extend the result, change the tone, extract RPG assets, download it, or save it to a campaign that remembers your world.",
  },
];

// Visible primary tools that also appear in the ItemList JSON-LD below — only
// mark up what is actually rendered on the page (real, crawlable URLs).
const PRIMARY_TOOLS = [
  { name: "Fantasy Story Generator", url: genrePath("fantasy") },
  { name: "NPC Generator", url: rpgToolPath("npc-generator") },
  {
    name: "Character Backstory Generator",
    url: rpgToolPath("character-backstory-generator"),
  },
  { name: "D&D Name Generator", url: rpgToolPath("dnd-name-generator") },
  { name: "Quest Hook Generator", url: rpgToolPath("quest-hook-generator") },
];

export default function Home() {
  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: "AI Story Generator",
        url: `${SITE_URL}/`,
        applicationCategory: "WritingApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#tools`,
        name: "Free AI story and RPG generators",
        itemListElement: PRIMARY_TOOLS.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          url: `${SITE_URL}${t.url}`,
        })),
      },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Section 1: Hero + Quick Start */}
      <section
        className="hero-band"
        style={{
          background: [
            "linear-gradient(90deg, var(--bg) 8%, rgba(15,16,32,0.6) 48%, rgba(15,16,32,0.2) 100%)",
            "linear-gradient(0deg, var(--bg) 1%, transparent 55%)",
            "url(/illustrations/hero-home.jpg) right center / cover no-repeat",
          ].join(", "),
        }}
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free AI Story Generator · no login
          </div>
          <h1>Free AI Story Generator</h1>
          <div className="hero-grid">
            <div className="hero-col">
              <p className="lead">
                Turn any idea into an original short story — pick a genre, tone,
                length, and point of view, then generate. Free, with no login.
                Plus RPG tools for Game Masters when you need them.
              </p>
              <ul className="hero-bullets">
                <li>Original short stories in any genre, tone, and length</li>
                <li>Free · no login required to generate</li>
                <li>
                  Plus RPG tools for Game Masters — NPCs, quests, and campaigns
                </li>
              </ul>
              <div className="actions" style={{ marginTop: 24 }}>
                <TrackedLink
                  href="#generator"
                  event="home_hero_cta_click"
                  eventProps={{ cta: "generate_story" }}
                  className="primary"
                  style={{
                    display: "inline-block",
                    padding: "12px 18px",
                    borderRadius: 12,
                    color: "#111324",
                    fontWeight: 750,
                  }}
                >
                  Generate a Story
                </TrackedLink>
                <TrackedLink
                  href="/rpg-tools/npc-generator"
                  event="home_hero_cta_click"
                  eventProps={{ cta: "create_npc" }}
                  className="ghost"
                  style={{
                    display: "inline-block",
                    padding: "12px 18px",
                    borderRadius: 12,
                  }}
                >
                  Create an NPC
                </TrackedLink>
              </div>
              <p className="lead" style={{ marginTop: 14, fontSize: 14 }}>
                <TrackedLink
                  href="/story-generators"
                  event="home_hero_cta_click"
                  eventProps={{ cta: "browse_all_tools" }}
                >
                  Browse all tools →
                </TrackedLink>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inline AI Story Generator — the homepage IS the flagship generator now
          (the former /ai-story-generator page 301s here). scrollMarginTop offsets
          the sticky header for the hero "#generator" CTA and Quick Start. */}
      <section
        id="generator"
        className="wrap"
        style={{ paddingTop: 28, scrollMarginTop: 80 }}
      >
        <StoryGenerator />
      </section>

      <div className="wrap">
        {/* Section 3: Start with a story, turn it into a campaign */}
        <section className="section">
          <h2>From AI story to full D&amp;D campaign</h2>
          <p className="lead" style={{ maxWidth: 760 }}>
            The generators aren&apos;t one-and-done. Generate a story, extract
            its cast as <Link href={rpgToolPath("npc-generator")}>NPCs</Link>,
            spin its premise into a{" "}
            <Link href={rpgToolPath("campaign-plot-generator")}>
              campaign plot
            </Link>{" "}
            and{" "}
            <Link href={rpgToolPath("quest-hook-generator")}>quest hooks</Link>,
            and grow it all inside a campaign your tools remember from one
            session to the next.
          </p>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {WORKFLOW.map((s) => (
              <div key={s.n} className="card" style={{ cursor: "default" }}>
                <span className="step-num">{s.n}</span>
                <h3 style={{ margin: "0 0 6px" }}>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>

          {/* Aha moment */}
          <div className="card" style={{ marginTop: 16, cursor: "default" }}>
            <p className="example-meta">The aha moment</p>
            <p className="example-out" style={{ fontStyle: "normal" }}>
              Your generated story contains: 4 NPCs · 3 locations · 5 quest
              hooks · 2 unresolved mysteries — Save them to a campaign?
            </p>
            <div className="actions" style={{ marginTop: 14 }}>
              <TrackedLink
                href="/campaigns"
                event="home_story_to_campaign_cta_click"
                eventProps={{ cta: "save_to_campaign" }}
                className="primary"
                style={{
                  display: "inline-block",
                  padding: "12px 18px",
                  borderRadius: 12,
                  color: "#111324",
                  fontWeight: 750,
                }}
              >
                Save to Campaign
              </TrackedLink>
              <TrackedLink
                href="/rpg-tools"
                event="home_story_to_campaign_cta_click"
                eventProps={{ cta: "explore_rpg_tools" }}
                className="ghost"
                style={{
                  display: "inline-block",
                  padding: "12px 18px",
                  borderRadius: 12,
                }}
              >
                Explore RPG Tools
              </TrackedLink>
            </div>
          </div>
        </section>

        {/* Section 5: Free AI generators */}
        <section className="section">
          <h2>Free AI story and RPG generators</h2>
          <p className="lead">
            Jump straight into any tool — all free, no sign-up.
          </p>

          {[STORY_DIRECTORY, RPG_DIRECTORY].map((group) => (
            <div key={group.label} style={{ marginTop: 24 }}>
              <h3 style={{ margin: "0 0 4px" }}>{group.label}</h3>
              <div className="tools-grid" style={{ marginTop: 12 }}>
                {group.items.map((item) => (
                  <Link key={item.href} className="card" href={item.href}>
                    <h3>{item.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <p className="lead" style={{ marginTop: 18, fontSize: 14 }}>
            See all <Link href="/story-generators">Story Generators →</Link> and{" "}
            <Link href="/rpg-tools">RPG Tools →</Link>
          </p>
        </section>

        {/* Section 6: Built for tabletop RPG sessions */}
        <section className="section">
          <h2>Built for D&amp;D and tabletop RPG Game Masters</h2>
          <p className="lead" style={{ maxWidth: 760 }}>
            The content is system-agnostic, so it drops straight into whatever
            you run — whether you&apos;re prepping a long campaign or
            improvising a solo one-shot.
          </p>
          <div className="chips">
            {RPG_SYSTEMS.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>

          <div className="card" style={{ marginTop: 20, cursor: "default" }}>
            <h3 style={{ margin: "0 0 6px" }}>
              For Game Masters who prep late
            </h3>
            <p>
              Session in a few hours and nothing written? Grab a batch of quest
              hooks you can run straight from the screen.
            </p>
            <p style={{ marginTop: 12 }}>
              <Link href={rpgToolPath("quest-hook-generator")}>
                Prep a session →
              </Link>
            </p>
          </div>
        </section>

        {/* Section 7: Example outputs */}
        <section className="section">
          <h2>Example AI story and NPC outputs</h2>
          <p className="lead">
            A taste of what comes out — real shapes of content, ready to run.
          </p>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {EXAMPLE_OUTPUTS.map((ex) => (
              <div key={ex.meta} className="card" style={{ cursor: "default" }}>
                <p className="example-meta">{ex.meta}</p>
                <p className="example-out">{ex.text}</p>
                <p style={{ marginTop: 12 }}>
                  <TrackedLink
                    href={ex.href}
                    event="home_example_output_cta_click"
                    eventProps={{ example: ex.meta }}
                  >
                    {ex.ctaLabel}
                  </TrackedLink>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: How it works */}
        <section className="section">
          <h2>How the AI story generator works</h2>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} className="card" style={{ cursor: "default" }}>
                <span className="step-num">{s.n}</span>
                <h3 style={{ margin: "0 0 6px" }}>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 9: Why use AIStoryGenerator instead of a generic chat tool? */}
        <section className="section">
          <h2>Why use AIStoryGenerator instead of a generic chat tool?</h2>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {WHY_CARDS.map((c) => (
              <div key={c.title} className="card" style={{ cursor: "default" }}>
                <h3 style={{ margin: "0 0 6px" }}>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 10: FAQ */}
        <section className="section" style={{ paddingBottom: 16 }}>
          <h2>Frequently asked questions</h2>
          {HOME_FAQ.map((f) => (
            <div key={f.q} style={{ marginTop: 18, maxWidth: 820 }}>
              <h3 style={{ margin: "0 0 6px" }}>{f.q}</h3>
              <p className="lead" style={{ margin: 0 }}>
                {f.a}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
