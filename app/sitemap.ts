import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { STORY_GENRES, genrePath } from "@/lib/story-genres";
import { RPG_TOOLS, rpgToolPath } from "@/lib/rpg-tools";
import { BLOG_POSTS } from "@/lib/blog-posts";

// Public, crawlable content pages. The campaign workspace and story library are
// per-user app pages (not SEO targets), so they're intentionally excluded.
// Tool and genre pages are derived from their registries so this stays in sync.
const STATIC_PATHS = [
  "", // home
  "/story-generators", // story generators hub
  "/story-generators/short-story",
  "/story-generators/prompts",
  "/ai-story-generator",
  "/long-story-generator",
  "/rpg-tools", // rpg tools hub
  "/pricing",
  "/blog",
  "/about",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const toolEntries = RPG_TOOLS.map((t) => ({
    url: `${SITE_URL}${rpgToolPath(t.slug)}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  const genreEntries = STORY_GENRES.map((g) => ({
    url: `${SITE_URL}${genrePath(g.slug)}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  const blogEntries = BLOG_POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticEntries, ...toolEntries, ...genreEntries, ...blogEntries];
}
