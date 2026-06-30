import Link from "next/link";
import { TavernNameGenerator } from "./tavern-name-generator";
import { ToolFaq, type Faq } from "../tool-faq";
import { ToolSections } from "@/components/tool-sections";
import { RelatedTools } from "@/components/related-tools";

// Server page: hero, prose, FAQ + JSON-LD, related links. SEO metadata +
// canonical live in the co-located layout.tsx (the tool is a client island).

const FAQS: Faq[] = [
  {
    q: "Is the tavern name generator free?",
    a: "Yes. Generate as many tavern and inn names as you like with no account or payment required.",
  },
  {
    q: "What do I get besides a name?",
    a: "Twelve names, each with a one-line hook on who runs the place or what makes it worth a scene — so a name doubles as a ready encounter.",
  },
  {
    q: "Can I control the style?",
    a: "Yes. Pick an establishment type and a vibe — cozy, seedy, haunted, upscale — and optionally a setting or region to match your world.",
  },
  {
    q: "Is it just for taverns?",
    a: "It covers taverns, inns, alehouses, teahouses, and gambling dens, and the same approach fits most fantasy establishments.",
  },
  {
    q: "Does it work outside D&D?",
    a: "Yes. The names and hooks are system-agnostic, so they drop into Pathfinder, OSR, or any tabletop RPG.",
  },
];

export default function TavernNameGeneratorPage() {
  return (
    <main>
      <section
        className="hero-band has-art"
        style={
          {
            "--hero-art": "url(/illustrations/hero-fairy-tale.jpg)",
          } as React.CSSProperties
        }
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Tavern Name Generator · no login
          </div>
          <h1>Tavern &amp; Inn Name Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Drop a memorable watering hole into your session — 12 tavern and inn
            names, each with a one-line hook on who runs it and what makes it
            worth a scene. Built for D&amp;D, Pathfinder, and any fantasy world.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <TavernNameGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the tavern name generator works</h2>
          <p className="lead">
            Pick an establishment type and vibe, optionally add a region, and
            generate a batch of twelve. Each name lands with a one-line hook —
            the retired adventurer behind the bar, the smugglers&apos; front in
            the back room — so the place is ready to play, not just labeled. Hit{" "}
            <strong>More names</strong> for another round.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Build the scene out: staff the bar with an{" "}
            <Link href="/rpg-tools/npc-generator">NPC</Link>, set it inside a{" "}
            <Link href="/rpg-tools/settlement-generator">settlement</Link>, and
            save the whole place into a <Link href="/campaigns">campaign</Link>{" "}
            your tools remember across sessions.
          </p>

          <ToolSections
            slug="tavern-name-generator"
            name="Tavern Name Generator"
          />

          <ToolFaq name="Tavern & Inn Name Generator" faqs={FAQS} />

          <RelatedTools currentSlug="tavern-name-generator" />
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
