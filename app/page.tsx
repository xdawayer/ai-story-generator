import type { Metadata } from "next";
import Link from "next/link";
import {
  Beer,
  BookOpen,
  Dices,
  Gem,
  Rocket,
  ScrollText,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";
import { genrePath } from "@/lib/story-genres";

export const metadata: Metadata = {
  title: "AI Story Generator for Game Masters — Free D&D & RPG Tools",
  description:
    "Free AI story and RPG content generator for Game Masters. Generate stories, NPCs, campaign openings, quest hooks, backstories, and D&D names — no login. Save them to a campaign when you sign up.",
  keywords: [
    "ai story generator",
    "ai story generator for dnd",
    "rpg story generator",
    "game master story generator",
  ],
  alternates: { canonical: "/" },
};

// Section 5 samples are static, hand-written examples — never live model calls
// (keeps the homepage free to render and avoids any generation cost on load).
const EXAMPLES = [
  {
    meta: "Fantasy campaign opening",
    text: "The bells of Hollow Reach haven't rung in thirty years — not since the night the sea gave back its dead. Now a child has started ringing them again, and three kingdoms each want to know why before the others do.",
  },
  {
    meta: "Mysterious NPC",
    text: "Wren Calloway, the Lantern-Keeper, speaks only in questions and trades secrets for names. Nobody remembers hiring her, but the lighthouse has never once gone dark — and she knows which of the party is being followed.",
  },
  {
    meta: "Tavern with a plot hook",
    text: "The Gilded Minnow: a riverside inn where the ale is watered and the rooms are spotless. The innkeeper pays too well for old maps, and the cellar only floods on nights with no moon.",
  },
  {
    meta: "Villain backstory",
    text: "Sir Aldric once carried wounded men three days through the Ashmarch. The order he saved repaid him with a quiet grave and a stolen name. He came back. He intends to return all of it, with interest.",
  },
];

const STEPS = [
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
    title: "Continue, regenerate, download, or save",
    body: "Extend it beat by beat, get a fresh take, download it, or save it to a campaign that remembers your world.",
  },
];

const FAQS = [
  {
    q: "Is it free?",
    a: "Yes. Every generator is free to use and you can copy or download what you create instantly. Saving your work into a persistent campaign is the optional next step.",
  },
  {
    q: "Do I need to log in?",
    a: "No login is required to generate. You only create an account when you want to save stories, NPCs, and campaign notes so your tools remember them across sessions.",
  },
  {
    q: "Who owns the content I generate?",
    a: "You do. Output is original fiction generated for you. We ask the model to avoid imitating copyrighted franchises, but always review before publishing.",
  },
  {
    q: "Can I use it commercially?",
    a: "Yes — you can use the output in your own commercial work, including published adventures and streamed games. Review it first to make sure it fits your needs and is original.",
  },
  {
    q: "Can I use it for D&D and other tabletop RPGs?",
    a: "Absolutely. It's built for tabletop play — D&D 5e, Pathfinder, OSR retroclones, homebrew worlds, and solo RPGs. The content is system-agnostic, so it drops into any ruleset.",
  },
  {
    q: "How does saving work?",
    a: "Create a free account (with email or Google) and you can save stories, NPCs, factions, locations, and plot threads into a campaign. Everything you keep stays linked to your world.",
  },
  {
    q: "What about privacy?",
    a: "We collect as little as possible and don't sell your data. See our privacy policy for exactly what's processed and why.",
  },
];

export default function Home() {
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
    name: "AI Story Generator for Game Masters",
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

      {/* Hero */}
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
            <span className="dot" /> Free AI tools for tabletop RPG Game Masters
          </div>
          <h1>AI Story Generator for Game Masters</h1>
          <ul className="hero-bullets">
            <li>Free AI story and RPG content generator</li>
            <li>No login required to generate</li>
            <li>
              Save stories, NPCs, and campaign notes when you create an account
            </li>
          </ul>
          <div className="actions" style={{ marginTop: 24 }}>
            <Link
              className="primary"
              href="/ai-story-generator"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 12,
                color: "#111324",
                fontWeight: 750,
              }}
            >
              Generate a Story
            </Link>
            <Link
              className="ghost"
              href="/rpg-tools/npc-generator"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 12,
              }}
            >
              Create an NPC
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        {/* Section 1: What can you generate? */}
        <section className="section">
          <h2>What can you generate?</h2>
          <p className="lead">
            One toolkit for everything you improvise at the table — finished
            prose and ready-to-run table content alike.
          </p>
          <div className="chips">
            <span className="chip">Short stories</span>
            <span className="chip">Campaign openings</span>
            <span className="chip">Quest hooks</span>
            <span className="chip">NPCs</span>
            <span className="chip">Character backstories</span>
            <span className="chip">D&amp;D names</span>
            <span className="chip">Tavern and inn names</span>
          </div>
        </section>

        {/* Section 2: Start with a story, turn it into a campaign */}
        <section className="section">
          <h2>Start with a story, turn it into a campaign</h2>
          <p className="lead" style={{ maxWidth: 760 }}>
            The generators aren&apos;t one-and-done. Generate a story, pull its
            cast out as NPCs, and grow them into factions and plot threads
            inside a campaign your tools remember from one session to the next.
            Prep compounds instead of starting from a blank page every week.
          </p>
          <div className="loop">
            <b>Story</b>
            <span className="loop-arrow">→</span>
            <b>characters</b>
            <span className="loop-arrow">→</span>
            <b>NPCs</b>
            <span className="loop-arrow">→</span>
            <b>factions</b>
            <span className="loop-arrow">→</span>
            <b>plot threads</b>
            <span className="loop-arrow">→</span>
            <b>saved campaign memory</b>
          </div>
          <p className="lead" style={{ marginTop: 18, fontSize: 14 }}>
            <Link href="/campaigns">Open your campaigns →</Link>
          </p>
        </section>

        {/* Section 3: Free AI generators */}
        <section className="section">
          <h2>Free AI generators</h2>
          <p className="lead">
            Jump straight into any tool — all free, no sign-up.
          </p>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            <Link className="card" href="/ai-story-generator">
              <h3>
                <BookOpen size={18} /> AI Story Generator
              </h3>
              <p>
                Turn any idea into an original story in seconds, in any genre.
              </p>
            </Link>
            <Link className="card" href={genrePath("fantasy")}>
              <h3>
                <Sparkles size={18} /> Fantasy Story Generator
              </h3>
              <p>Magic, quests, and kingdoms that never were.</p>
            </Link>
            <Link className="card" href={genrePath("sci-fi")}>
              <h3>
                <Rocket size={18} /> Sci-Fi Story Generator
              </h3>
              <p>Starships, rogue AI, and far-future worlds.</p>
            </Link>
            <Link className="card" href="/rpg-tools/npc-generator">
              <h3>
                <Users size={18} /> AI NPC Generator
              </h3>
              <p>A table-ready NPC with voice, personality, and a plot hook.</p>
            </Link>
            <Link
              className="card"
              href="/rpg-tools/character-backstory-generator"
            >
              <h3>
                <ScrollText size={18} /> Character Backstory Generator
              </h3>
              <p>
                Origin, motivation, flaw, bond, and secret for any character.
              </p>
            </Link>
            <Link className="card" href="/rpg-tools/dnd-name-generator">
              <h3>
                <Dices size={18} /> D&amp;D Name Generator
              </h3>
              <p>Fast, fitting fantasy names by race and culture.</p>
            </Link>
            <Link className="card" href="/rpg-tools/tavern-name-generator">
              <h3>
                <Beer size={18} /> Tavern Name Generator
              </h3>
              <p>Memorable taverns and inns, each with a one-line hook.</p>
            </Link>
            <Link className="card" href="/rpg-tools/random-encounter-generator">
              <h3>
                <Swords size={18} /> Random Encounter Generator{" "}
                <span className="badge">new</span>
              </h3>
              <p>
                Combat, social, and environmental encounters, each with a twist.
              </p>
            </Link>
            <Link className="card" href="/rpg-tools/magic-item-generator">
              <h3>
                <Gem size={18} /> Magic Item Generator{" "}
                <span className="badge">new</span>
              </h3>
              <p>Original magic items with an effect and a story hook.</p>
            </Link>
          </div>
          <p className="lead" style={{ marginTop: 18, fontSize: 14 }}>
            See all <Link href="/story-generators">story generators</Link> and{" "}
            <Link href="/rpg-tools">RPG tools</Link>.
          </p>
        </section>

        {/* Section 4: Built for tabletop RPG sessions */}
        <section className="section">
          <h2>Built for tabletop RPG sessions</h2>
          <p className="lead" style={{ maxWidth: 760 }}>
            The content is system-agnostic, so it drops straight into whatever
            you run — whether you&apos;re prepping a long campaign or
            improvising a solo one-shot.
          </p>
          <div className="chips">
            <span className="chip">D&amp;D 5e</span>
            <span className="chip">Pathfinder</span>
            <span className="chip">OSR &amp; retroclones</span>
            <span className="chip">Homebrew worlds</span>
            <span className="chip">Solo RPG</span>
            <span className="chip">One-shots &amp; campaigns</span>
          </div>
        </section>

        {/* Section 5: Example outputs */}
        <section className="section">
          <h2>Example outputs</h2>
          <p className="lead">
            A taste of what comes out — real shapes of content, ready to run.
          </p>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {EXAMPLES.map((ex) => (
              <div key={ex.meta} className="card" style={{ cursor: "default" }}>
                <p className="example-meta">{ex.meta}</p>
                <p className="example-out">{ex.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: How it works */}
        <section className="section">
          <h2>How it works</h2>
          <div className="tools-grid" style={{ marginTop: 16 }}>
            {STEPS.map((s) => (
              <div key={s.n} className="card" style={{ cursor: "default" }}>
                <span className="step-num">{s.n}</span>
                <h3 style={{ margin: "0 0 6px" }}>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: FAQ */}
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
      </div>
    </main>
  );
}
