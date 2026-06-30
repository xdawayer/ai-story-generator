// "Related tools" cross-link block for the RPG tool pages (the P3 internal-linking
// requirement). Server component, data-driven from the RPG registry + the
// RELATED_TOOLS map, so labels and URLs can never drift from the real pages.
import Link from "next/link";
import { getRpgTool, rpgToolPath } from "@/lib/rpg-tools";
import { getRelatedTools } from "@/lib/rpg-tool-content";

export function RelatedTools({ currentSlug }: { currentSlug: string }) {
  const tools = getRelatedTools(currentSlug)
    .map((slug) => getRpgTool(slug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  if (tools.length === 0) return null;

  return (
    <>
      <h2 style={{ marginTop: 28 }}>Related tools</h2>
      <ul style={{ color: "var(--muted)", lineHeight: 1.8 }}>
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link href={rpgToolPath(tool.slug)}>{tool.name}</Link> — {tool.blurb}
          </li>
        ))}
        <li>
          <Link href="/rpg-tools">All RPG tools →</Link>
        </li>
      </ul>
    </>
  );
}
