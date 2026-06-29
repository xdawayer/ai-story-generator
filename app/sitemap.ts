import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { STORY_GENRES } from "@/lib/story-genres";

// Public, crawlable content pages. The campaign workspace and story library are
// per-user app pages (not SEO targets), so they're intentionally excluded.
const STATIC_PATHS = [
  "",
  "/ai-story-generator",
  "/npc-generator",
  "/character-backstory",
  "/dnd-name-generator",
  "/tavern-name-generator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const genreEntries = STORY_GENRES.map((g) => ({
    url: `${SITE_URL}/${g.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...staticEntries, ...genreEntries];
}
