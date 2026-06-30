import type { Metadata } from "next";

// The page itself is a client component (it streams + saves), so its SEO
// metadata + canonical live here in a co-located layout.
export const metadata: Metadata = {
  title: "Free NPC Generator for D&D & Tabletop RPGs",
  description:
    "Free NPC generator for D&D and tabletop RPGs. Race, role, alignment, and tone in — a ready-to-run NPC with appearance, personality, voice, and a plot hook out. Save it to a campaign.",
  keywords: [
    "npc generator",
    "ai npc generator",
    "dnd npc generator",
    "d&d character generator",
  ],
  alternates: { canonical: "/rpg-tools/npc-generator" },
  openGraph: {
    title: "Free NPC Generator for D&D & Tabletop RPGs",
    description:
      "Generate a table-ready NPC in seconds, then save it to a campaign that remembers your world.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
