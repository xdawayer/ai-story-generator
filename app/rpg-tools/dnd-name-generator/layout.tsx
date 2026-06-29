import type { Metadata } from "next";

// Page is a client component; SEO metadata + canonical live in this layout.
export const metadata: Metadata = {
  title: "D&D Name Generator — Fantasy Names by Race",
  description:
    "Free D&D name generator. Fast, fitting fantasy names by race and culture — elf, dwarf, human, tiefling, and more — for characters, NPCs, and places. No sign-up.",
  keywords: [
    "dnd name generator",
    "d&d name generator",
    "fantasy name generator",
    "rpg name generator",
  ],
  alternates: { canonical: "/rpg-tools/dnd-name-generator" },
  openGraph: {
    title: "D&D Name Generator — Fantasy Names by Race",
    description:
      "Fast, fitting fantasy names by race and culture for characters, NPCs, and places.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
