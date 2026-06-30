"use client";

// Global navigation header rendered on every page (from the root layout). The two
// top-level destinations (Story Generators, RPG Tools) each keep a directly
// clickable hub link plus a dropdown of every destination underneath. The
// dropdown items are derived from the registries (story-genres / rpg-tools) so the
// nav can never drift from the actual pages.
//
// This is a client component because the dropdowns need interaction state
// (hover/click/focus open, Escape + outside-click to close). The repo constraint
// limits edits to this file and globals.css, so the interactive piece lives here
// rather than in a separate "use client" child. AccountMenu stays its own client
// component and is untouched.
import { useEffect, useId, useRef, useState } from "react";
import type { FocusEvent } from "react";
import Link from "next/link";
import { AccountMenu } from "@/components/account-menu";
import { STORY_GENRES, genrePath } from "@/lib/story-genres";
import { RPG_TOOLS, rpgToolPath } from "@/lib/rpg-tools";

interface NavItem {
  href: string;
  label: string;
}

// Story Generators: the flagship generator, every genre landing page (full h1),
// then the length/format variants. NOTE the prompt + short-story tools live under
// /story-generators/* — there is no /story-prompt-generator or
// /short-story-generator route.
const STORY_ITEMS: readonly NavItem[] = [
  { href: "/", label: "AI Story Generator" },
  ...STORY_GENRES.map((g) => ({ href: genrePath(g.slug), label: g.h1 })),
  { href: "/long-story-generator", label: "Long Story Generator" },
  { href: "/story-generators/short-story", label: "Short Story Generator" },
  { href: "/story-generators/prompts", label: "Story Prompt Generator" },
];

// RPG Tools: every tool in the registry, by its full name.
const RPG_ITEMS: readonly NavItem[] = RPG_TOOLS.map((t) => ({
  href: rpgToolPath(t.slug),
  label: t.name,
}));

function NavDropdown({
  hubHref,
  hubLabel,
  items,
}: {
  hubHref: string;
  hubLabel: string;
  items: readonly NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Close on Escape or a click/tap outside the dropdown.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Close once keyboard focus leaves the whole dropdown (Tab past the last item).
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  }

  return (
    <div
      ref={wrapRef}
      className="nav-dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={handleBlur}
    >
      <span className="nav-dropdown-head">
        {/* Hub link stays directly clickable — navigation is never trapped. */}
        <Link href={hubHref} className="nav-dropdown-hub">
          {hubLabel}
        </Link>
        <button
          type="button"
          className="nav-dropdown-toggle"
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${hubLabel} menu`}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="nav-dropdown-caret" aria-hidden="true" />
        </button>
      </span>
      <div id={panelId} className="nav-dropdown-panel" hidden={!open}>
        <ul className="nav-dropdown-list">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="nav-dropdown-item">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link href="/" className="brand" aria-label="Home">
          <span className="brand-mark" aria-hidden="true" />
          AI Story Generator
        </Link>
        <nav className="nav" aria-label="Primary">
          <NavDropdown
            hubHref="/story-generators"
            hubLabel="Story Generators"
            items={STORY_ITEMS}
          />
          <NavDropdown
            hubHref="/rpg-tools"
            hubLabel="RPG Tools"
            items={RPG_ITEMS}
          />
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
