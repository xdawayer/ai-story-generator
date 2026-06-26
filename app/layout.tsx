import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI NPC & Story Generator for Game Masters",
  description:
    "Free AI tools for tabletop RPG Game Masters — generate NPCs, hooks, and stories, then save them to a campaign that remembers your world.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
