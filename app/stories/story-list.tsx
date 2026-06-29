"use client";

// Client list for the saved-stories library: expand to read, or download as
// Markdown. Server data arrives as plain props.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { downloadText, printDocument, slugFilename } from "@/lib/download";
import { ConfirmButton } from "@/components/confirm-button";
import { deleteStoryAction } from "@/app/actions";

export interface StoryItem {
  id: string;
  title: string;
  content: string;
  campaignName: string;
  created_at: string;
}

function StoryRow({ story }: { story: StoryItem }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="panel" style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>{story.title}</h3>
          <p className="statusline" style={{ margin: "2px 0 0" }}>
            {story.created_at.slice(0, 10)} · {story.campaignName}
          </p>
        </div>
        <div className="actions" style={{ margin: 0 }}>
          <button
            className="ghost"
            type="button"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Hide" : "Read"}
          </button>
          <button
            className="ghost"
            type="button"
            onClick={() =>
              downloadText(slugFilename(story.title), story.content)
            }
          >
            Download .md
          </button>
          <button
            className="ghost"
            type="button"
            onClick={() => printDocument(story.title, story.content)}
          >
            Print / PDF
          </button>
          <ConfirmButton
            label="Delete"
            confirmLabel="Confirm delete"
            onConfirm={async () => {
              await deleteStoryAction(story.id);
              router.refresh();
            }}
          />
        </div>
      </div>
      {open && <div className="out">{story.content}</div>}
    </div>
  );
}

export function StoryList({ stories }: { stories: StoryItem[] }) {
  return (
    <div style={{ marginTop: 18 }}>
      {stories.map((s) => (
        <StoryRow key={s.id} story={s} />
      ))}
      <p className="statusline">
        Want these woven into a recap?{" "}
        <Link href="/campaigns">Open the campaign →</Link>
      </p>
    </div>
  );
}
