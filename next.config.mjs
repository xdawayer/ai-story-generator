import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Permanent (301) redirects from the pre-restructure flat URLs to the new IA
// (/rpg-tools/* and /story-generators/*), so any indexed or shared old links
// keep their equity and never 404. Old genre slugs all ended in "-generator".
const OLD_TOOL_REDIRECTS = [
  ["/npc-generator", "/rpg-tools/npc-generator"],
  ["/character-backstory", "/rpg-tools/character-backstory-generator"],
  ["/dnd-name-generator", "/rpg-tools/dnd-name-generator"],
  ["/tavern-name-generator", "/rpg-tools/tavern-name-generator"],
];

const OLD_GENRE_REDIRECTS = [
  ["/fantasy-story-generator", "/story-generators/fantasy"],
  ["/sci-fi-story-generator", "/story-generators/sci-fi"],
  ["/horror-story-generator", "/story-generators/horror"],
  ["/mystery-story-generator", "/story-generators/mystery"],
  ["/romance-story-generator", "/story-generators/romance"],
  ["/fairy-tale-generator", "/story-generators/fairy-tale"],
  ["/adventure-story-generator", "/story-generators/adventure"],
  ["/cyberpunk-story-generator", "/story-generators/cyberpunk"],
  ["/western-story-generator", "/story-generators/western"],
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this project (a package-lock.json in $HOME would
  // otherwise be inferred as the root and skew serverless file tracing).
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
  async redirects() {
    return [...OLD_TOOL_REDIRECTS, ...OLD_GENRE_REDIRECTS].map(
      ([source, destination]) => ({ source, destination, permanent: true }),
    );
  },
};

export default nextConfig;
