import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AI NPC & Story Generator for Game Masters",
  description:
    "Free AI tools for tabletop RPG Game Masters — generate NPCs, hooks, and stories, then save them to a campaign that remembers your world.",
  alternates: { canonical: "/" },
  // Default Twitter preview inherited by every page that doesn't set its own.
  twitter: {
    card: "summary_large_image",
    title: "AI NPC & Story Generator for Game Masters",
    description:
      "Free AI tools for tabletop RPG Game Masters — generate NPCs, hooks, and stories, then save them to a campaign that remembers your world.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
