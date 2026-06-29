import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, BLOG_BODIES, getBlogPost } from "@/lib/blog-posts";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const Body = BLOG_BODIES[slug];
  if (!post || !Body) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Organization", name: "AI Story Generator" },
  };

  return (
    <main className="hero wrap" style={{ maxWidth: 760, marginInline: "auto" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <p className="statusline">
        <Link href="/blog">← Blog</Link> · {post.date}
      </p>
      <h1 style={{ fontSize: "clamp(28px, 4.5vw, 44px)" }}>{post.title}</h1>
      <div style={{ marginTop: 18 }}>
        <Body />
      </div>

      <div className="panel" style={{ marginTop: 32 }}>
        <p className="lead" style={{ margin: 0 }}>
          Ready to build? Try the{" "}
          <Link href="/npc-generator">NPC Generator</Link> or the{" "}
          <Link href="/ai-story-generator">AI Story Generator</Link> — free, no
          login.
        </p>
      </div>

      <p className="lead" style={{ fontSize: 14, marginTop: 20 }}>
        <Link href="/blog">← More guides</Link>
      </p>
    </main>
  );
}
