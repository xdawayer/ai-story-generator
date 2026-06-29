import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Game Master's Blog — Guides & Tips",
  description:
    "Practical guides for tabletop RPG Game Masters: running sessions, building NPCs, worldbuilding, and using AI tools well.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <main className="hero wrap">
      <div className="eyebrow">
        <span className="dot" /> Game Master&apos;s Blog
      </div>
      <h1>Guides for Game Masters</h1>
      <p className="lead">
        Practical, no-fluff guides for running better tabletop RPG sessions — and
        getting the most from the free tools.
      </p>

      <div style={{ marginTop: 24 }}>
        {BLOG_POSTS.map((post) => (
          <article className="panel" key={post.slug} style={{ marginBottom: 14 }}>
            <p className="statusline" style={{ marginTop: 0 }}>
              {post.date}
            </p>
            <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="lead" style={{ margin: 0 }}>
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>

      <p className="lead" style={{ fontSize: 14, marginTop: 20 }}>
        <Link href="/">← All Game Master tools</Link>
      </p>
    </main>
  );
}
