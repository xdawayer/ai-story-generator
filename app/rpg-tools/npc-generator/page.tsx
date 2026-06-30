import Link from "next/link";
import { NpcGenerator } from "./npc-generator";
import { ToolFaq, type Faq } from "../tool-faq";

// Server page: hero, prose, FAQ + JSON-LD, and the story→NPC→campaign wedge.
// SEO metadata + canonical live in the co-located layout.tsx (the tool itself is
// a client island, so metadata can't live in this tree's client component).

const FAQS: Faq[] = [
  {
    q: "Is the NPC generator free?",
    a: "Yes. Generate as many NPCs as you like with no account. Saving an NPC into a persistent campaign takes a free login.",
  },
  {
    q: "What does each NPC include?",
    a: "An appearance, a personality, a performable voice, a plot hook tied to the party, and a system-agnostic stat seed — everything you need to run them at the table.",
  },
  {
    q: "Which systems does it work with?",
    a: "Any. NPCs are written system-agnostic, so they drop into D&D 5e, Pathfinder, OSR, and other tabletop RPGs.",
  },
  {
    q: "Can I save NPCs and reuse them?",
    a: "Yes. Save an NPC to a campaign and it stays there session after session, alongside your plots, settlements, and other saved tools.",
  },
  {
    q: "Can I steer who I get?",
    a: "Yes. Choose a race, role, alignment, and tone, and add free-text details like a name, a quirk, or a secret connection to the party.",
  },
];

export default function NpcGeneratorPage() {
  return (
    <main>
      <section
        className="hero-band has-art"
        style={
          {
            "--hero-art": "url(/illustrations/hero-fantasy.jpg)",
          } as React.CSSProperties
        }
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free NPC Generator · no login
          </div>
          <h1>NPC Generator for D&amp;D and Tabletop RPGs</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Describe the role and tone — get a table-ready NPC with appearance,
            personality, a performable voice, a plot hook, and a system-agnostic
            stat seed. Works for D&amp;D 5e, Pathfinder, and OSR.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <NpcGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the NPC generator works</h2>
          <p className="lead">
            Pick a race, role, alignment, and tone — or leave them blank for a
            surprise — and generate. Each NPC comes out specific and ready to
            run: a face, a personality, a voice you can perform, and a hook that
            pulls them into the story instead of leaving them set dressing. Hit{" "}
            <strong>Regenerate</strong> for a fresh take.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            This is the heart of the wedge: turn a <Link href="/">story</Link>{" "}
            into NPCs, give one a{" "}
            <Link href="/rpg-tools/character-backstory-generator">
              backstory
            </Link>{" "}
            or a quick <Link href="/rpg-tools/dnd-name-generator">name</Link>,
            then save them into a <Link href="/campaigns">campaign</Link> your
            tools remember across sessions.
          </p>

          <ToolFaq name="NPC Generator" faqs={FAQS} />
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
