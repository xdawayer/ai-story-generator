"use client";

// One saved NPC as a click-to-expand card. Collapsed: just the name + epithet.
// Expanded: the full generated NPC rendered as Markdown (appearance, personality,
// voice, plot hook, stat seed), with the Secret hidden behind a spoiler so it
// isn't exposed to players glancing at the screen. Actions live inside the body.
import { useRouter } from "next/navigation";
import { deleteNpcAction } from "@/app/actions";
import { Markdown } from "@/components/markdown";
import { CopyButton } from "@/components/copy-button";
import { ConfirmButton } from "@/components/confirm-button";
import type { LinkRef, LinkTarget } from "@/lib/link-kinds";
import { Connections } from "./connections";

// First non-empty line, stripped of heading markers — the NPC's name + epithet.
function npcTitle(content: string): string {
  const line = content.split("\n").find((l) => l.trim().length > 0) ?? "NPC";
  return (
    line
      .replace(/^#+\s*/, "")
      .trim()
      .slice(0, 120) || "NPC"
  );
}

// Drop the leading title line so the expanded body doesn't repeat the summary.
function npcBody(content: string): string {
  const lines = content.split("\n");
  const idx = lines.findIndex((l) => l.trim().length > 0);
  return lines
    .slice(idx + 1)
    .join("\n")
    .trim();
}

export function NpcCard({
  id,
  content,
  campaignId,
  links,
  targets,
}: {
  id: string;
  content: string;
  campaignId: string;
  links: LinkRef[];
  targets: LinkTarget[];
}) {
  const router = useRouter();
  const title = npcTitle(content);
  const body = npcBody(content);

  return (
    <details className="entry" id={`entry-npc-${id}`}>
      <summary className="entry-head">
        <span className="entry-title">{title}</span>
      </summary>
      <div className="entry-body">
        <Markdown text={body} spoilerLabels={["Secret"]} />
        <Connections
          campaignId={campaignId}
          node={{ kind: "npc", id }}
          links={links}
          targets={targets}
        />
        <div className="actions entry-actions">
          <CopyButton text={content} />
          <ConfirmButton
            label="Delete"
            confirmLabel="Confirm delete"
            onConfirm={async () => {
              await deleteNpcAction(id);
              router.refresh();
            }}
          />
        </div>
      </div>
    </details>
  );
}
