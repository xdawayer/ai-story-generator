"use client";

// One saved story as a click-to-expand card. Collapsed: title + date. Expanded:
// the full story rendered as Markdown, with Copy / Download / Delete actions.
import { useRouter } from "next/navigation";
import { deleteStoryAction } from "@/app/actions";
import { Markdown } from "@/components/markdown";
import { CopyButton } from "@/components/copy-button";
import { ConfirmButton } from "@/components/confirm-button";
import { downloadText, slugFilename } from "@/lib/download";
import type { LinkRef, LinkTarget } from "@/lib/link-kinds";
import { Connections } from "./connections";

export function StoryCard({
  id,
  title,
  content,
  createdAt,
  campaignId,
  links,
  targets,
}: {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  campaignId: string;
  links: LinkRef[];
  targets: LinkTarget[];
}) {
  const router = useRouter();
  const name = title || "Untitled story";

  return (
    <details className="entry" id={`entry-story-${id}`}>
      <summary className="entry-head">
        <span className="entry-title">{name}</span>
        {links.length > 0 && (
          <span
            className="entry-count"
            title={`${links.length} connection${links.length === 1 ? "" : "s"}`}
          >
            {links.length}
          </span>
        )}
        <span className="entry-date">{createdAt.slice(0, 10)}</span>
      </summary>
      <div className="entry-body">
        <Markdown text={content} />
        <Connections
          campaignId={campaignId}
          node={{ kind: "story", id }}
          links={links}
          targets={targets}
          text={content}
        />
        <div className="actions entry-actions">
          <CopyButton text={content} />
          <button
            className="ghost"
            type="button"
            onClick={() => downloadText(slugFilename(name), content)}
          >
            Download .md
          </button>
          <ConfirmButton
            label="Delete"
            confirmLabel="Confirm delete"
            onConfirm={async () => {
              await deleteStoryAction(id);
              router.refresh();
            }}
          />
        </div>
      </div>
    </details>
  );
}
