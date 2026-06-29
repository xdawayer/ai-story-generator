import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Beer,
  Compass,
  Dices,
  Library,
  Map as MapIcon,
  ScrollText,
  Swords,
  Users,
} from "lucide-react";
import { STORY_GENRES, genrePath } from "@/lib/story-genres";

export const metadata: Metadata = {
  title: "AI Story Generator for Game Masters — Free D&D & RPG Tools",
  description:
    "A free AI story generator built for Game Masters. Generate D&D and RPG stories, NPCs, campaign plots, and quest hooks in seconds — then save them to a campaign that remembers your world.",
  keywords: [
    "ai story generator",
    "ai story generator for dnd",
    "rpg story generator",
    "game master story generator",
  ],
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
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
          <p className="lead">
            An AI story generator built for D&amp;D and tabletop RPGs. Spin up
            stories, NPCs, campaign plots, and quest hooks in seconds — then save
            them to a campaign with a persistent world, factions, and plot
            threads. The free generators are the front door; the saved campaign
            is the product.
          </p>
          <div className="actions" style={{ marginTop: 22 }}>
            <Link
              className="primary"
              href="/story-generators"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 12,
                color: "#111324",
                fontWeight: 750,
              }}
            >
              Story Generators
            </Link>
            <Link
              className="ghost"
              href="/rpg-tools"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 12,
              }}
            >
              RPG Tools
            </Link>
            <Link
              className="ghost"
              href="/campaigns"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 12,
              }}
            >
              Your campaigns
            </Link>
          </div>
        </div>
      </section>

      {/* The two hubs — the spine of the site's information architecture. */}
      <section className="wrap" style={{ paddingTop: 28 }}>
        <div className="tools-grid">
          <Link className="card" href="/story-generators">
            <h3>
              <BookOpen size={18} /> Story Generators
            </h3>
            <p>
              Turn any idea into an original story — by genre, one-shot, or a
              long-form story written chapter by chapter. Free, no sign-up.
            </p>
          </Link>
          <Link className="card" href="/rpg-tools">
            <h3>
              <Swords size={18} /> RPG &amp; Game Master Tools
            </h3>
            <p>
              NPCs, character backstories, D&amp;D and tavern names, campaign
              plots, and quest hooks — everything to prep and run a session.
            </p>
          </Link>
        </div>

        <h2 style={{ marginTop: 40 }}>Popular generators</h2>
        <div className="tools-grid" style={{ marginTop: 12 }}>
          <Link className="card" href="/rpg-tools/npc-generator">
            <h3>
              <Users size={18} /> NPC Generator{" "}
              <span className="badge">live</span>
            </h3>
            <p>
              Race, role, alignment, tone → a ready-to-run NPC with appearance,
              personality, voice, plot hook, and a system-agnostic stat seed.
            </p>
          </Link>
          <Link className="card" href="/rpg-tools/campaign-plot-generator">
            <h3>
              <MapIcon size={18} /> Campaign Plot Generator{" "}
              <span className="badge">new</span>
            </h3>
            <p>
              A full campaign skeleton — premise, villain, three acts, a twist,
              and a climax — from a single one-line idea.
            </p>
          </Link>
          <Link className="card" href="/rpg-tools/quest-hook-generator">
            <h3>
              <Compass size={18} /> Quest Hook Generator{" "}
              <span className="badge">new</span>
            </h3>
            <p>
              A batch of ready-to-run quest hooks, each a one-or-two-sentence
              seed for your next session.
            </p>
          </Link>
          <Link className="card" href="/rpg-tools/character-backstory-generator">
            <h3>
              <ScrollText size={18} /> Character Backstory{" "}
              <span className="badge">live</span>
            </h3>
            <p>
              Origin, defining moment, motivation, flaw, bond, and secret — for
              player characters and villains alike.
            </p>
          </Link>
          <Link className="card" href="/rpg-tools/dnd-name-generator">
            <h3>
              <Dices size={18} /> D&amp;D Name Generator{" "}
              <span className="badge">live</span>
            </h3>
            <p>
              Fast, fitting names by race and culture — the highest-frequency GM
              micro-need.
            </p>
          </Link>
          <Link className="card" href="/rpg-tools/tavern-name-generator">
            <h3>
              <Beer size={18} /> Tavern Name Generator{" "}
              <span className="badge">live</span>
            </h3>
            <p>
              Memorable taverns and inns with a one-line hook each — drop one
              straight into a session.
            </p>
          </Link>
          <Link className="card" href="/ai-story-generator">
            <h3>
              <BookOpen size={18} /> AI Story Generator{" "}
              <span className="badge">live</span>
            </h3>
            <p>
              The broad story tool — turn any idea into a story, continue it,
              then save it or pull its characters into a campaign.
            </p>
          </Link>
          <Link className="card" href="/long-story-generator">
            <h3>
              <Library size={18} /> Long Story Generator{" "}
              <span className="badge">live</span>
            </h3>
            <p>
              Plan a chapter outline, then write a long-form story chapter by
              chapter with continuity kept across chapters.
            </p>
          </Link>
        </div>

        <p className="lead" style={{ marginTop: 22, fontSize: 14 }}>
          Story generators by genre:{" "}
          {STORY_GENRES.map((g, i) => (
            <span key={g.slug}>
              {i > 0 && " · "}
              <Link href={genrePath(g.slug)}>{g.label}</Link>
            </span>
          ))}
        </p>
      </section>
    </main>
  );
}
