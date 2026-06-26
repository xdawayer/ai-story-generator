import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero wrap">
        <div className="eyebrow">
          <span className="dot" /> Free AI tools for tabletop RPG Game Masters
        </div>
        <h1>Generate NPCs your campaign remembers.</h1>
        <p className="lead">
          Spin up a characterful NPC in seconds, then save it to a campaign with
          a persistent world, factions, and plot threads. The free generators
          are the front door — the saved campaign is the product.
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
        </div>

        <div className="tools-grid">
          <div className="card">
            <h3>
              NPC Generator <span className="badge">live</span>
            </h3>
            <p>
              Race, role, alignment, tone → a ready-to-run NPC with appearance,
              personality, voice, plot hook, and a system-agnostic stat seed.
            </p>
          </div>
          <div className="card">
            <h3>
              Character Backstory <span className="badge">soon</span>
            </h3>
            <p>
              Motivation, flaw, and arc for player characters and villains
              alike.
            </p>
          </div>
          <div className="card">
            <h3>
              D&amp;D Name Generator <span className="badge">soon</span>
            </h3>
            <p>
              Fast, fitting names by race and culture — the highest-frequency GM
              micro-need.
            </p>
          </div>
          <div className="card">
            <h3>
              AI Story Generator <span className="badge">soon</span>
            </h3>
            <p>
              The broad story tool, kept as a top-of-funnel — turn any idea into
              a story, then bring it into a campaign.
            </p>
          </div>
        </div>
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
