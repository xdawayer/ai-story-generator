"use client";

// Shown under a finished story: name a campaign, then either save the whole
// story into it or pull its characters out as NPCs. This is the story -> campaign
// bridge made real (the moat), replacing the old plain text links.
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { extractCharactersAction, saveStoryAction } from "@/app/actions";

const supabaseReady = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export function StorySavePanel({
  story,
  inputs,
}: {
  story: string;
  inputs: Record<string, string>;
}) {
  const [name, setName] = useState("My Campaign");
  const [savingStory, setSavingStory] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [msg, setMsg] = useState<ReactNode>("");
  const [err, setErr] = useState("");

  if (!supabaseReady) return null;

  const busy = savingStory || pulling;

  async function saveStory() {
    setSavingStory(true);
    setErr("");
    setMsg("");
    const res = await saveStoryAction({ campaignName: name, content: story, inputs });
    setSavingStory(false);
    if (res.ok) {
      setMsg(
        <>
          Saved to <strong>{name}</strong>.{" "}
          <Link href="/stories">See your stories →</Link>
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
    <div className="panel" style={{ marginTop: 14 }}>
      <h3 style={{ margin: "0 0 4px" }}>Keep this story</h3>
      <p className="statusline" style={{ marginTop: 0 }}>
        Save it into a campaign your tools remember — or turn its characters into
        ready-to-run NPCs.
      </p>

      <div className="field">
        <label htmlFor="campaign-name">Campaign</label>
        <input
          id="campaign-name"
          type="text"
          value={name}
          maxLength={80}
          placeholder="My Campaign"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="actions">
        <button
          className="primary"
          type="button"
          onClick={saveStory}
          disabled={busy}
        >
          {savingStory ? "Saving…" : "Save story"}
        </button>
        <button
          className="ghost"
          type="button"
          onClick={pullCharacters}
          disabled={busy}
        >
          {pulling ? "Reading…" : "Pull characters → NPCs"}
        </button>
      </div>

      {err && <div className="errorbox">{err}</div>}
      {msg && (
        <p className="statusline" style={{ marginTop: 10 }}>
          {msg}
        </p>
      )}
    </div>
  );
}
