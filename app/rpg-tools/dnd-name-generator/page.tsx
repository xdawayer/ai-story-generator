import Link from "next/link";
import { DndNameGenerator } from "./dnd-name-generator";
import { ToolFaq, type Faq } from "../tool-faq";

// Server page: hero, prose, FAQ + JSON-LD, related links. SEO metadata +
// canonical live in the co-located layout.tsx (the tool is a client island).

const FAQS: Faq[] = [
  {
    q: "Is the D&D name generator free?",
    a: "Yes. Generate as many names as you like with no account or payment required.",
  },
  {
    q: "How many names do I get, and do they have meanings?",
    a: "Twelve per batch, each with a quick note on its meaning or feel so one is more likely to click. Hit More names for a fresh set.",
  },
  {
    q: "Which races and cultures does it cover?",
    a: "Human, elf, dwarf, halfling, orc, tiefling, gnome, dragonborn, goblin, and more — and you can add a culture or vibe like Norse-inspired or desert nomad to steer the sound.",
  },
  {
    q: "Can I use it for places, not just characters?",
    a: "Yes. The names lean toward characters and NPCs, but the culture and vibe fields work just as well for towns, taverns, and regions.",
  },
  {
    q: "Does it work outside D&D?",
    a: "Yes. The names suit any fantasy setting — Pathfinder, OSR, or your homebrew world.",
  },
];

export default function DndNameGeneratorPage() {
  return (
    <main>
      <section
        className="hero-band has-art"
        style={
          {
            "--hero-art": "url(/illustrations/hero-rpg-tools.jpg)",
          } as React.CSSProperties
        }
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free D&amp;D Name Generator · no login
          </div>
          <h1>D&amp;D Name Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Stuck for a name at the table? Get 12 fitting names by race and
            culture in seconds — each with a quick meaning so one will click.
            Works for D&amp;D 5e, Pathfinder, and any fantasy setting.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <DndNameGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the D&amp;D name generator works</h2>
          <p className="lead">
            Pick a race and name style, optionally add a culture or vibe, and
            generate a batch of twelve. Names are built to sound like they belong
            to that people — not random syllables — and each comes with a short
            note so you can pick on feel. Hit <strong>More names</strong> for a
            fresh dozen.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Naming is the fastest need at the table — and the on-ramp to the
            rest. Found the one? Give them a{" "}
            <Link href="/rpg-tools/character-backstory-generator">
              backstory
            </Link>
            , build the full{" "}
            <Link href="/rpg-tools/npc-generator">NPC</Link>, and save them into
            a <Link href="/campaigns">campaign</Link> your tools remember.
          </p>

          <ToolFaq name="D&D Name Generator" faqs={FAQS} />
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
