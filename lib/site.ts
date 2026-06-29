// Canonical site origin, used for absolute URLs in metadata, sitemap, and robots.
// Override with NEXT_PUBLIC_SITE_URL if the production domain ever changes.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://aistorygenerator.work"
).replace(/\/$/, "");

export const SITE_NAME = "AI Story Generator";
