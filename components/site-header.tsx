// Global navigation header rendered on every page (from the root layout) so each
// tool, the campaign workspace, and the story library are reachable from
// anywhere — a launch-standard requirement. Server component; pure links.
import Link from "next/link";

const NAV = [
  { href: "/ai-story-generator", label: "Story" },
  { href: "/npc-generator", label: "NPC" },
  { href: "/character-backstory", label: "Backstory" },
  { href: "/dnd-name-generator", label: "Names" },
  { href: "/tavern-name-generator", label: "Taverns" },
];

export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link href="/" className="brand" aria-label="Home">
          <span className="brand-mark" aria-hidden="true" />
          AI Story Generator
        </Link>
        <nav className="nav" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <span className="nav-sep" aria-hidden="true">
            ·
          </span>
          <Link href="/campaigns">Campaigns</Link>
          <Link href="/stories">Stories</Link>
        </nav>
      </div>
    </header>
  );
}
