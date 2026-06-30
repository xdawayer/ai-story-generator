import type { Metadata } from "next";
import Link from "next/link";
import { SettlementGenerator } from "./settlement-generator";
import { ToolFaq, type Faq } from "../tool-faq";
import { RelatedTools } from "@/components/related-tools";
import { ToolSections } from "@/components/tool-sections";

export const metadata: Metadata = {
  title: "Settlement & Town Generator — Free D&D Towns",
  description:
    "Free settlement and town generator for D&D and tabletop RPGs. Get a town with vibe, notable locations, people to meet, and trouble brewing — by type and setting. No sign-up.",
  keywords: [
    "town generator",
    "settlement generator",
    "dnd town generator",
    "rpg city generator",
  ],
  alternates: { canonical: "/rpg-tools/settlement-generator" },
  openGraph: {
    title: "Settlement & Town Generator — Free D&D Towns",
    description:
      "A town with vibe, notable locations, people to meet, and trouble brewing.",
    type: "website",
  },
};

const FAQS: Faq[] = [
  {
    q: "Is the settlement generator free?",
    a: "Yes. Generate as many towns as you like with no account. Saving a settlement into a persistent campaign is the optional next step.",
  },
  {
    q: "What does a generated settlement include?",
    a: "A distinct vibe, three notable locations, two or three NPCs with hooks, and a local problem the party can get pulled into — enough to run a visit on the fly.",
  },
  {
    q: "What sizes of settlement can it make?",
    a: "Anything from a tiny hamlet to a sprawling city. Pick a type, or leave it blank and let the generator choose.",
  },
  {
    q: "Does it work outside D&D?",
    a: "Yes. Everything is system-agnostic — no stat blocks — so it drops straight into Pathfinder, OSR, or any tabletop RPG.",
  },
  {
    q: "Can I keep a town for later?",
    a: "Yes. Save it to a campaign so its locations and NPCs are there next session, alongside everything else your tools remember.",
  },
];

export default function SettlementGeneratorPage() {
  return (
    <main>
      <section
        className="hero-band has-art"
        style={
          {
            "--hero-art": "url(/illustrations/hero-settlement.jpg)",
          } as React.CSSProperties
        }
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free Settlement Generator · no login
          </div>
          <h1>Settlement &amp; Town Generator</h1>
          <p className="lead" style={{ maxWidth: 760 }}>
            Conjure a place the party can actually walk into — a hamlet,
            village, town, or city with a distinct vibe, notable locations,
            people worth meeting, and trouble brewing. Built for D&amp;D,
            Pathfinder, and any tabletop RPG.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <SettlementGenerator />

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>How the settlement generator works</h2>
          <p className="lead">
            Pick a settlement type, vibe, and setting — or leave them blank —
            and generate a place with three notable locations, two or three NPCs
            with hooks, and a local problem the party can get pulled into.
            It&apos;s specific and system-agnostic, ready to run on the fly. Hit{" "}
            <strong>Regenerate</strong> for a new town.
          </p>
          <p className="lead" style={{ marginTop: 16 }}>
            Bring it to life: name the inn with the{" "}
            <Link href="/rpg-tools/tavern-name-generator">
              Tavern Name Generator
            </Link>
            , flesh out a local with the{" "}
            <Link href="/rpg-tools/npc-generator">NPC Generator</Link>, and save
            it all to a <Link href="/campaigns">campaign</Link>.
          </p>

          <ToolSections
            slug="settlement-generator"
            name="Settlement Generator"
          />

          <ToolFaq name="Settlement & Town Generator" faqs={FAQS} />

          <RelatedTools currentSlug="settlement-generator" />
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/rpg-tools">← All RPG tools</Link>
        </p>
      </section>
    </main>
  );
}
