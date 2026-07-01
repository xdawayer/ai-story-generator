"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";
import { trackEvent } from "@/lib/track";
import { readStory, type StoryHandoff } from "@/lib/story-handoff";

const SETTINGS = [
  "",
  "Fantasy",
  "Sci-fi",
  "Horror",
  "Modern / urban",
  "Cyberpunk",
  "Western",
];
const KINDS = [
  "",
  "Combat",
  "Intrigue",
  "Mystery",
  "Exploration",
  "Rescue",
  "Heist",
  "Escort",
];
const TONES = ["", "Heroic", "Grim", "Comedic", "Mysterious", "Epic"];
const LEVELS = ["", "Low level", "Mid level", "High level"];

export function QuestHookGenerator() {
  const gen = useStreamGenerate("/api/generate-quest");
  const formRef = useRef<HTMLFormElement>(null);
  // A story handed over from the story generator's "Turn into quest hook" action.
  // Read on arrival (gated by ?source=story) so hooks are grounded in it.
  const [source, setSource] = useState<StoryHandoff | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("source") !== "story") return;
    const handoff = readStory();
    if (handoff) setSource(handoff);
  }, []);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    trackEvent("generate", {
      tool: "quest-hook-generator",
      ...(source ? { mode: "from-story" } : {}),
    });
    void gen.generate({
      setting: data.get("setting"),
      kind: data.get("kind"),
      tone: data.get("tone"),
      level: data.get("level"),
      detail: data.get("detail"),
      sourceStory: source?.story ?? "",
    });
  }

  return (
    <div className="tool">
      {source && (
        <div className="source-note" role="status">
          <span>
            Grounding hooks in your story:{" "}
            <strong>{source.title || "Untitled story"}</strong>
          </span>
          <button
            type="button"
            className="linklike"
            onClick={() => setSource(null)}
          >
            Use a blank form instead
          </button>
        </div>
      )}
      <form
        className="panel"
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <div className="row2">
          <div className="field">
            <label htmlFor="setting">Setting</label>
            <select id="setting" name="setting" defaultValue="">
              {SETTINGS.map((s) => (
                <option key={s} value={s}>
                  {s || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="kind">Quest type</label>
            <select id="kind" name="kind" defaultValue="">
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="tone">Tone</label>
            <select id="tone" name="tone" defaultValue="">
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="level">Party level</label>
            <select id="level" name="level" defaultValue="">
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="detail">Extra guidance (optional)</label>
          <textarea
            id="detail"
            name="detail"
            maxLength={200}
            placeholder="A coastal town, a missing tax collector, a cult moving in next door…"
          />
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Scheming…" : "Generate hooks"}
          </button>
          {gen.busy && (
            <button className="ghost" type="button" onClick={gen.stop}>
              Stop
            </button>
          )}
        </div>
      </form>

      <OutputPanel
        gen={gen}
        emptyHint={
          <>
            8 quest hooks will appear here. Pick a setting (or none) and hit{" "}
            <strong>Generate hooks</strong>.
          </>
        }
        extraActions={
          <button className="ghost" type="button" onClick={run}>
            More hooks
          </button>
        }
        cta={
          <>
            Found a keeper? Build it out into a{" "}
            <Link href="/rpg-tools/campaign-plot-generator">
              full campaign plot →
            </Link>{" "}
            and save it.
          </>
        }
      />
    </div>
  );
}
