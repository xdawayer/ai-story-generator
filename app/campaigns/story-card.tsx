"use client";

// One saved story as a click-to-expand card. Collapsed: title + date. Expanded:
// the full story rendered as Markdown, with Copy / Download / Delete actions.
import { useRouter } from "next/navigation";
import { deleteStoryAction } from "@/app/actions";
import { Markdown } from "@/components/markdown";
import { CopyButton } from "@/components/copy-button";
import { ConfirmButton } from "@/components/confirm-button";
import { downloadText, slugFilename } from "@/lib/download";

export function StoryCard({
  id,
  title,
  content,
  createdAt,
}: {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}) {
  const router = useRouter();
  const name = title || "Untitled story";

  return (
    <details className="entry">
      <summary className="entry-head">
        <span className="entry-title">{name}</span>
        <span className="entry-date">{createdAt.slice(0, 10)}</span>
      </summary>
      <div className="entry-body">
        <Markdown text={content} />
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
