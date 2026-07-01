"use client";

// Shown under a finished story: name a campaign, then either save the whole
// story into it or pull its characters out as NPCs. This is the story -> campaign
// bridge made real (the moat), replacing the old plain text links.
import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  extractCharactersAction,
  saveStoryWithElementsAction,
} from "@/app/actions";
import type { StoryElements } from "@/lib/story-elements-prompt";
import { trackEvent } from "@/lib/track";

const supabaseReady = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

// "Added: 1 story, 3 characters, 2 locations, 4 plot hooks" — omit empty
// categories so the summary only names what actually landed.
function summarizeAdded(a: {
  stories: number;
  characters: number;
  locations: number;
  plotHooks: number;
}): string {
  const plural = (n: number, one: string, many: string) =>
    `${n} ${n === 1 ? one : many}`;
  return [
    a.stories && plural(a.stories, "story", "stories"),
    a.characters && plural(a.characters, "character", "characters"),
    a.locations && plural(a.locations, "location", "locations"),
    a.plotHooks && plural(a.plotHooks, "plot hook", "plot hooks"),
  ]
    .filter(Boolean)
    .join(", ");
}

export function StorySavePanel({
  story,
  elements,
  elementsLoading,
  inputs,
}: {
  story: string;
  elements: StoryElements | null;
  elementsLoading: boolean;
  inputs: Record<string, string>;
}) {
  const [name, setName] = useState("My Campaign");
  const [savingStory, setSavingStory] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState<ReactNode>("");
  const [err, setErr] = useState("");

  if (!supabaseReady) return null;

  const busy = savingStory || pulling;

  async function saveStory() {
    setSavingStory(true);
    setErr("");
    setMsg("");
    const res = await saveStoryWithElementsAction({
      campaignName: name,
      content: story,
      inputs,
      elements: {
        characters: elements?.characters ?? [],
        locations: elements?.locations ?? [],
        plotHooks: elements?.plotHooks ?? [],
      },
    });
    setSavingStory(false);
    if (res.ok) {
      setSaved(true); // block a duplicate story insert on a second click
      trackEvent("save_to_campaign", { tool: "story" });
      const summary = res.added ? summarizeAdded(res.added) : "";
      setMsg(
        <>
          Saved to <strong>{name}</strong>.
          {summary ? ` Added: ${summary}. ` : " "}
          <Link href="/campaigns">Open the campaign →</Link>
        </>,
      );
    } else {
      setErr(res.error ?? "Could not save the story.");
    }
  }

  async function pullCharacters() {
    setPulling(true);
    setErr("");
    setMsg("");
    const res = await extractCharactersAction({ campaignName: name, story });
    setPulling(false);
    if (res.ok) {
      trackEvent("extract_characters", {
        tool: "story",
        count: res.count ?? 0,
      });
      setMsg(
        <>
          Saved {res.count} character{res.count === 1 ? "" : "s"} as NPCs in{" "}
          <strong>{name}</strong>.{" "}
          <Link href="/campaigns">Open the campaign →</Link>
        </>,
      );
    } else {
      setErr(res.error ?? "Could not extract characters.");
    }
  }

  return (
    <div className="panel" id="save-panel" style={{ marginTop: 14 }}>
      <h3 style={{ margin: "0 0 4px" }}>Keep this story</h3>
      <p className="statusline" style={{ marginTop: 0 }}>
        Save the story with its characters, locations, and plot hooks into a
        campaign your tools remember — or pull its characters out as fuller
        NPCs.
      </p>

      <div className="field">
        <label htmlFor="campaign-name">Campaign</label>
        <input
          id="campaign-name"
          type="text"
          value={name}
          maxLength={80}
          placeholder="My Campaign"
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false); // renaming targets a different campaign — allow save
          }}
        />
      </div>

      <div className="actions">
        <button
          className="primary"
          type="button"
          onClick={saveStory}
          disabled={busy || elementsLoading || saved}
        >
          {savingStory
            ? "Saving…"
            : saved
              ? "Saved ✓"
              : elementsLoading
                ? "Analyzing story…"
                : "Save to Campaign"}
        </button>
        <button
          className="ghost"
          type="button"
          onClick={pullCharacters}
          disabled={busy}
        >
          {pulling ? "Reading…" : "Extract NPCs"}
        </button>
      </div>

      {elementsLoading && !saved && (
        <p className="statusline" style={{ marginTop: 10 }}>
          Analyzing the story for characters, locations, and plot hooks — one
          moment so they save with it.
        </p>
      )}
      {err && <div className="errorbox">{err}</div>}
      {msg && (
        <p className="statusline" style={{ marginTop: 10 }}>
          {msg}
        </p>
      )}
    </div>
  );
}
