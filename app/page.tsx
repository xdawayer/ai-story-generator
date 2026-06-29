import Link from "next/link";
import { BookOpen, Beer, Dices, ScrollText, Users } from "lucide-react";
import { STORY_GENRES } from "@/lib/story-genres";

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
          <h1>Generate NPCs your campaign remembers.</h1>
          <p className="lead">
            Spin up a characterful NPC in seconds, then save it to a campaign
            with a persistent world, factions, and plot threads. The free
            generators are the front door — the saved campaign is the product.
          </p>
          <div className="actions" style={{ marginTop: 22 }}>
            <Link
              className="primary"
              href="/npc-generator"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 12,
                color: "#111324",
                fontWeight: 750,
              }}
            >
              Open the NPC Generator
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
            <Link
              className="ghost"
              href="/stories"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 12,
              }}
            >
              Your stories
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28 }}>
        <div className="tools-grid">
          <Link className="card" href="/npc-generator">
            <h3>
              <Users size={18} /> NPC Generator{" "}
              <span className="badge">live</span>
            </h3>
            <p>
              Race, role, alignment, tone → a ready-to-run NPC with appearance,
              personality, voice, plot hook, and a system-agnostic stat seed.
            </p>
          </Link>
          <Link className="card" href="/character-backstory">
            <h3>
              <ScrollText size={18} /> Character Backstory{" "}
              <span className="badge">live</span>
            </h3>
            <p>
              Origin, defining moment, motivation, flaw, bond, and secret — for
              player characters and villains alike.
            </p>
          </Link>
          <Link className="card" href="/dnd-name-generator">
            <h3>
              <Dices size={18} /> D&amp;D Name Generator{" "}
              <span className="badge">live</span>
            </h3>
            <p>
              Fast, fitting names by race and culture — the highest-frequency GM
              micro-need.
            </p>
          </Link>
          <Link className="card" href="/tavern-name-generator">
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
              The broad story tool, kept as a top-of-funnel — turn any idea into
              a story, continue it, then save it or pull its characters into a
              campaign.
            </p>
          </Link>
        </div>

        <p className="lead" style={{ marginTop: 22, fontSize: 14 }}>
          Story generators by genre:{" "}
          {STORY_GENRES.map((g, i) => (
            <span key={g.slug}>
              {i > 0 && " · "}
              <Link href={`/${g.slug}`}>{g.label}</Link>
            </span>
          ))}
        </p>
      </section>

      <footer>
        <div className="wrap">
          Early build. Free generators today; saved campaigns, exports, and
          accounts next.
        </div>
      </footer>
    </main>
  );
}
