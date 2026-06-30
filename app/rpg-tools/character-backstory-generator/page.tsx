import Link from "next/link";
import { CharacterBackstoryGenerator } from "./character-backstory-generator";
import { ToolFaq, type Faq } from "../tool-faq";
import { ToolSections } from "@/components/tool-sections";
import { RelatedTools } from "@/components/related-tools";

// Server page: hero, prose, FAQ + JSON-LD, related links. SEO metadata +
// canonical live in the co-located layout.tsx (the tool is a client island).

const FAQS: Faq[] = [
  {
    q: "Is the character backstory generator free?",
    a: "Yes. Generate as many backstories as you like with no account or payment required.",
  },
  {
    q: "What's in a generated backstory?",
    a: "An origin, a defining moment, a motivation, a flaw, a bond, and a secret — the load-bearing pieces that make a character drive the plot instead of just standing in it.",
  },
  {
    q: "Does it work for villains as well as player characters?",
    a: "Yes. Set the character type to player character, villain, or supporting NPC and the backstory shifts to fit the role.",
  },
  {
    q: "Which systems is it for?",
    a: "Any. Backstories are narrative and system-agnostic, so they suit D&D 5e, Pathfinder, OSR, and beyond.",
  },
  {
    q: "What do I do with the backstory next?",
    a: "Turn it into a table-ready NPC, give the character a fitting name, and save the whole thing into a campaign your tools remember.",
  },
];

export default function CharacterBackstoryGeneratorPage() {
  return (
    <main>
      <section
        className="hero-band has-art"
        style={
          {
            "--hero-art": "url(/illustrations/hero-mystery.jpg)",
          } as React.CSSProperties
        }
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Character Backstory Generator · no
            login
          </div>
          <h1>AI Character Backstory Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Turn a race and class into a character with an origin, a defining
            moment, a motivation, a flaw, a bond, and a secret — table-ready for
            D&amp;D 5e, Pathfinder, and beyond.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <CharacterBackstoryGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the character backstory generator works</h2>
          <p className="lead">
            Choose a race, class, character type, alignment, and tone — or leave
            them blank — and generate. You get a structured past with a wound
            and a want, not a wall of generic lore, so the character has
            something to play toward and something to hide. Add a name or
            homeland in the details field, and hit <strong>Regenerate</strong>{" "}
            for a new angle.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Keep building: turn the character into a table-ready{" "}
            <Link href="/rpg-tools/npc-generator">NPC</Link>, find them a
            fitting <Link href="/rpg-tools/dnd-name-generator">name</Link>, and
            save the result into a <Link href="/campaigns">campaign</Link> your
            tools remember across sessions.
          </p>

          <ToolSections
            slug="character-backstory-generator"
            name="Character Backstory Generator"
          />

          <h2 style={{ marginTop: 28 }}>DnD Backstory Generator</h2>
          <p className="lead">
            Running D&amp;D 5e? Set a race and class and the generator anchors
            the backstory to your build — a dwarf cleric&apos;s broken oath, a
            tiefling rogue&apos;s debt — so it slots straight onto your
            character sheet. The same structure works for Pathfinder, OSR, and
            homebrew worlds.
          </p>

          <ToolFaq name="Character Backstory Generator" faqs={FAQS} />

          <RelatedTools currentSlug="character-backstory-generator" />
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
