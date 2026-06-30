import type { Metadata } from "next";

// Page is a client component; SEO metadata + canonical live in this layout.
export const metadata: Metadata = {
  title: "DnD Backstory Generator — Free, No Login",
  description:
    "Free DnD backstory generator for D&D 5e, Pathfinder, and tabletop RPGs. Get an origin, defining moment, motivation, flaw, bond, and secret for player characters and villains alike.",
  keywords: [
    "character backstory generator",
    "dnd backstory generator",
    "d&d character backstory generator",
    "rpg backstory generator",
  ],
  alternates: { canonical: "/rpg-tools/character-backstory-generator" },
  openGraph: {
    title: "DnD Backstory Generator — Free, No Login",
    description:
      "An origin, motivation, flaw, bond, and secret for any hero or villain — free, no sign-up.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
