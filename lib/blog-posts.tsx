// Blog content registry. Each post = metadata (for index/SEO) + a Body render
// function (the article JSX). Add a post here and its page + sitemap entry exist
// automatically. Long-tail GM content that internally links to the free tools.
import type { ReactNode } from "react";
import Link from "next/link";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
}

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: "how-to-run-your-first-dnd-session",
    title: "How to Run Your First D&D Session: A Game Master's Checklist",
    description:
      "A practical, no-fluff checklist for running your first Dungeons & Dragons session — prep, pacing, NPCs, and how to recover when players go off-script.",
    date: "2026-06-29",
    excerpt:
      "Everything a first-time Game Master actually needs for session one — and nothing they don't.",
  },
  {
    slug: "how-to-create-memorable-dnd-npcs",
    title: "How to Create Memorable D&D NPCs (with examples)",
    description:
      "The repeatable formula for NPCs your players remember: a want, a flaw, a voice, and a secret. With examples and a fast workflow.",
    date: "2026-06-29",
    excerpt:
      "Forgettable NPCs are a description. Memorable ones have a want, a flaw, a voice, and a secret.",
  },
] as const;

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

// Article bodies, keyed by slug. Plain prose + internal links to the tools.
export const BLOG_BODIES: Record<string, () => ReactNode> = {
  "how-to-run-your-first-dnd-session": () => (
    <>
      <p className="lead">
        Running your first session as a Game Master is less about knowing every
        rule and more about keeping the table moving and everyone having fun.
        Here&apos;s the short checklist I wish I&apos;d had.
      </p>

      <h2>1. Prep a situation, not a script</h2>
      <p className="lead">
        Players will ignore your plot. Instead of scripting scenes, prep a
        <em> situation</em>: a place, a problem, and three NPCs who each want
        something different. Drop the party in and react. If you need NPCs fast,
        generate a few with the{" "}
        <Link href="/npc-generator">NPC Generator</Link> and keep them on a card.
      </p>

      <h2>2. Open with a hook in the first five minutes</h2>
      <p className="lead">
        Start in motion — a tavern brawl, a scream down the hall, a job offer
        that&apos;s clearly a trap. Skip the &ldquo;you all meet in a
        tavern&rdquo; throat-clearing. A memorable inn helps; the{" "}
        <Link href="/tavern-name-generator">Tavern Name Generator</Link> gives
        you one with a built-in hook.
      </p>

      <h2>3. Have 3 names ready for anything</h2>
      <p className="lead">
        The most common scramble is a player asking &ldquo;what&apos;s the
        guard&apos;s name?&rdquo; Keep a short list from the{" "}
        <Link href="/dnd-name-generator">D&amp;D Name Generator</Link> so you
        never stall.
      </p>

      <h2>4. Manage pacing with a soft clock</h2>
      <p className="lead">
        When energy dips, escalate: a complication arrives, a timer ticks, an
        ally betrays them. End the session on a question, not a resolution —
        it&apos;s what brings everyone back.
      </p>

      <h2>5. Capture what happened</h2>
      <p className="lead">
        Two lines of notes after the session save you an hour next time. Saving
        your NPCs and a session log to a{" "}
        <Link href="/campaigns">persistent campaign</Link> means your tools can
        generate a &ldquo;previously on…&rdquo; recap grounded in your actual
        world — something a generic chatbot can&apos;t do.
      </p>

      <p className="lead">
        That&apos;s it. Prep a situation, hook fast, keep names handy, control
        pacing, and write it down. Have fun — the rest is improvisation.
      </p>
    </>
  ),

  "how-to-create-memorable-dnd-npcs": () => (
    <>
      <p className="lead">
        A forgettable NPC is a description (&ldquo;a gruff blacksmith&rdquo;). A
        memorable one is a <strong>person</strong> with wants and contradictions.
        Here&apos;s a formula you can run in under a minute.
      </p>

      <h2>The four-part formula</h2>
      <ul style={{ color: "var(--muted)", lineHeight: 1.9 }}>
        <li>
          <strong>A want</strong> — what they&apos;re chasing right now. This
          drives every scene they&apos;re in.
        </li>
        <li>
          <strong>A flaw</strong> — the thing that gets in their own way and
          makes them human.
        </li>
        <li>
          <strong>A voice</strong> — one performable quirk (a phrase, a cadence,
          a tic) so you can &ldquo;become&rdquo; them at the table.
        </li>
        <li>
          <strong>A secret</strong> — something the party can discover, turning
          the NPC into a plot hook.
        </li>
      </ul>

      <h2>Example</h2>
      <p className="lead">
        <strong>Maren Vale, harbor clerk.</strong> <em>Want:</em> buy back her
        family&apos;s seized ship. <em>Flaw:</em> she trusts ledgers over people.
        <em> Voice:</em> quotes regulations by number. <em>Secret:</em> she&apos;s
        been forging manifests to fund the buy-back. Suddenly a background clerk
        is a quest.
      </p>

      <h2>The fast workflow</h2>
      <p className="lead">
        You don&apos;t have to invent all four cold. Generate a complete NPC —
        appearance, personality, voice, plot hook, and a stat seed — with the{" "}
        <Link href="/npc-generator">NPC Generator</Link>, then tweak the want and
        secret to fit your story. For player characters and villains, the{" "}
        <Link href="/character-backstory">Character Backstory Generator</Link>{" "}
        gives you the origin, defining moment, and bond to build on.
      </p>

      <h2>Make them recur</h2>
      <p className="lead">
        The real payoff is reuse. Save NPCs to a{" "}
        <Link href="/campaigns">campaign</Link> so they come back across sessions
        with their wants evolving — that continuity is what players actually
        remember.
      </p>
    </>
  ),
};
