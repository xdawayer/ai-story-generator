import type { Metadata } from "next";

// Page is a client component; SEO metadata + canonical live in this layout.
export const metadata: Metadata = {
  title: "Tavern & Inn Name Generator — Free, No Login",
  description:
    "Free tavern and inn name generator for D&D and tabletop RPGs. Get a batch of memorable establishment names, each with a one-line hook you can drop straight into a session.",
  keywords: [
    "tavern name generator",
    "inn name generator",
    "dnd tavern name generator",
    "fantasy tavern name generator",
  ],
  alternates: { canonical: "/rpg-tools/tavern-name-generator" },
  openGraph: {
    title: "Tavern & Inn Name Generator — Free, No Login",
    description:
      "Memorable taverns and inns, each with a one-line hook for your next session.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
