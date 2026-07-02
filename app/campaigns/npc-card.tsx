"use client";

// One saved NPC as a click-to-expand card. Collapsed: just the name + epithet.
// Expanded: the full generated NPC rendered as Markdown (appearance, personality,
// voice, plot hook, stat seed), with the Secret hidden behind a spoiler so it
// isn't exposed to players glancing at the screen. Actions live inside the body.
// Thin stubs (e.g. story-extracted "name + role") get a "Flesh out" button that
// expands them into a full profile grounded in the world note + connections.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteNpcAction, fleshOutNpcAction } from "@/app/actions";
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
  const [msg, setMsg] = useState("");
  const title = npcTitle(content);
  const body = npcBody(content);
  // A stub reads thin (a role line, little else); a full profile runs far past
  // this. Only thin cards surface the Flesh out button.
  const thin = body.replace(/\s+/g, " ").length < 220;

  // Overwrites the stub, so it sits behind the same two-step confirm as Delete.
  async function flesh() {
    setMsg("");
    const res = await fleshOutNpcAction(id);
    if (!res.ok) {
      setMsg(res.error ?? "Could not flesh out this NPC.");
      return;
    }
    router.refresh();
  }

  return (
    <details className="entry" id={`entry-npc-${id}`}>
      <summary className="entry-head">
        <span className="entry-title">{title}</span>
        {links.length > 0 && (
          <span
            className="entry-count"
            title={`${links.length} connection${links.length === 1 ? "" : "s"}`}
          >
            {links.length}
          </span>
        )}
      </summary>
      <div className="entry-body">
        <Markdown text={body} spoilerLabels={["Secret"]} />
        <Connections
          campaignId={campaignId}
          node={{ kind: "npc", id }}
          links={links}
          targets={targets}
          text={content}
        />
        <div className="actions entry-actions">
          {thin ? (
            <ConfirmButton
              label="Flesh out"
              confirmLabel="Expand & overwrite"
              className="ghost flesh-btn"
              onConfirm={flesh}
            />
          ) : null}
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
        {msg ? <span className="statusline">{msg}</span> : null}
      </div>
    </details>
  );
}
