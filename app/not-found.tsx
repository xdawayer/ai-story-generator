import Link from "next/link";

// Custom 404 so a bad link still lands on a complete, on-brand page with a way
// forward (the global header is rendered by the layout above this).
export default function NotFound() {
  return (
    <main className="hero wrap">
      <div className="eyebrow">
        <span className="dot" /> 404
      </div>
      <h1>Page not found</h1>
      <p className="lead">
        That page doesn&apos;t exist (or moved). Here&apos;s where to go next:
      </p>
      <ul style={{ color: "var(--muted)", lineHeight: 1.9, marginTop: 12 }}>
        <li>
          <Link href="/ai-story-generator">AI Story Generator</Link> — turn an
          idea into a story.
        </li>
        <li>
          <Link href="/npc-generator">NPC Generator</Link> — a table-ready NPC in
          seconds.
        </li>
        <li>
          <Link href="/campaigns">Your campaigns</Link> and{" "}
          <Link href="/stories">your stories</Link>.
        </li>
      </ul>
      <p className="lead" style={{ fontSize: 14, marginTop: 18 }}>
        <Link href="/">← All Game Master tools</Link>
      </p>
    </main>
  );
}
