import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  Beer,
  Building2,
  Castle,
  Coins,
  Compass,
  Dices,
  Gem,
  Map as MapIcon,
  ScrollText,
  Swords,
  Users,
} from "lucide-react";
import { RPG_TOOLS, rpgToolPath } from "@/lib/rpg-tools";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "RPG Tools for Game Masters — Free AI Generators",
  description:
    "Free AI tools for tabletop RPG Game Masters: NPC generator, character backstories, D&D and tavern names, campaign plots, quest hooks, random encounters, and magic items. No sign-up — then save it all to a campaign.",
  keywords: ["rpg tools", "dnd tools", "game master tools", "d&d generator"],
  alternates: { canonical: "/rpg-tools" },
  openGraph: {
    title: "RPG Tools for Game Masters — Free AI Generators",
    description:
      "NPCs, backstories, names, campaign plots, and quest hooks — free, no sign-up.",
    type: "website",
  },
};

// Icon per tool slug — kept in this client-free server page (lucide icons render
// fine server-side) rather than in the data registry.
const ICONS: Record<string, ComponentType<{ size?: number }>> = {
  "npc-generator": Users,
  "character-backstory-generator": ScrollText,
  "dnd-name-generator": Dices,
  "tavern-name-generator": Beer,
  "campaign-plot-generator": MapIcon,
  "quest-hook-generator": Compass,
  "random-encounter-generator": Swords,
  "magic-item-generator": Gem,
  "loot-generator": Coins,
  "dungeon-generator": Castle,
  "settlement-generator": Building2,
};

export default function RpgToolsHub() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RPG tools for Game Masters",
    itemListElement: RPG_TOOLS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: `${SITE_URL}${rpgToolPath(t.slug)}`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <section
        className="hero-band has-art"
        style={
          {
            "--hero-art": "url(/illustrations/hero-rpg-tools.jpg)",
          } as React.CSSProperties
        }
      >
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Free AI tools for tabletop Game Masters
          </div>
          <h1>RPG &amp; Game Master Tools</h1>
          <p className="lead">
            Everything you need to prep and run a session — NPCs, backstories,
            names, campaign plots, and quest hooks. All free, no sign-up. Save
            what you keep into a campaign your tools remember.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 24 }}>
        <div className="tools-grid">
          {RPG_TOOLS.map((t) => {
            const Icon = ICONS[t.slug];
            return (
              <Link key={t.slug} className="card" href={rpgToolPath(t.slug)}>
                <h3>
                  {Icon && <Icon size={18} />} {t.name}{" "}
                  <span className="badge">live</span>
                </h3>
                <p>{t.blurb}</p>
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: 36, maxWidth: 760 }}>
          <h2>Looking for stories instead?</h2>
          <p className="lead">
            For finished prose — short stories, genre tales, and long-form
            chapters — head to the{" "}
            <Link href="/story-generators">story generators</Link>. Or keep
            everything in one place in{" "}
            <Link href="/campaigns">your campaigns</Link>.
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
          <Link href="/">← Home</Link>
        </p>
      </section>
    </main>
  );
}
