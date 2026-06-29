// Global navigation header rendered on every page (from the root layout). The two
// top-level destinations (Story Generators, RPG Tools) mirror the site's
// information architecture; the workspace links follow. Server component.
import Link from "next/link";
import { AccountMenu } from "@/components/account-menu";

const NAV = [
  { href: "/story-generators", label: "Story Generators" },
  { href: "/rpg-tools", label: "RPG Tools" },
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
          <Link href="/blog">Blog</Link>
          <Link href="/pricing">Pricing</Link>
          <AccountMenu />
        </nav>
      </div>
    </header>
  );
}
