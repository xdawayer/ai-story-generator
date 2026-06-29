"use client";

import Link from "next/link";
import { useRef } from "react";
import { useStreamGenerate } from "@/lib/use-stream-generate";
import { OutputPanel } from "@/components/output-panel";
import { trackEvent } from "@/lib/track";

const SETTINGS = [
  "",
  "High fantasy",
  "Dark fantasy",
  "Sci-fi",
  "Horror",
  "Cyberpunk",
  "Steampunk",
  "Modern / urban",
  "Western",
];
const TONES = [
  "",
  "Heroic",
  "Grim",
  "Political intrigue",
  "Mystery",
  "Comedic",
  "Epic",
];
const ARCS = ["", "3", "4", "5"];

export function CampaignPlotGenerator() {
  const gen = useStreamGenerate("/api/generate-campaign-plot");
  const formRef = useRef<HTMLFormElement>(null);

  function run() {
    const f = formRef.current;
    if (!f) return;
    const data = new FormData(f);
    trackEvent("generate", { tool: "campaign-plot-generator" });
    void gen.generate({
      idea: data.get("idea"),
      setting: data.get("setting"),
      tone: data.get("tone"),
      arcs: data.get("arcs"),
      detail: data.get("detail"),
    });
  }

  return (
    <div className="tool" style={{ gridTemplateColumns: "0.85fr 1.15fr" }}>
      <form
        className="panel"
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <div className="field">
          <label htmlFor="idea">Your idea (optional)</label>
          <textarea
            id="idea"
            name="idea"
            maxLength={400}
            placeholder="A dwarven hold has gone silent, and the rivers downstream are turning to glass…"
          />
        </div>

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
            <label htmlFor="tone">Tone</label>
            <select id="tone" name="tone" defaultValue="">
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="arcs">Acts</label>
          <select id="arcs" name="arcs" defaultValue="">
            {ARCS.map((a) => (
              <option key={a} value={a}>
                {a || "Let the AI decide"}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="detail">Extra guidance (optional)</label>
          <textarea
            id="detail"
            name="detail"
            maxLength={200}
            placeholder="Keep the villain sympathetic; the party should face a moral choice in Act II…"
          />
        </div>

        <div className="actions">
          <button className="primary" type="submit" disabled={gen.busy}>
            {gen.busy ? "Plotting…" : "Generate campaign plot"}
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
            Your campaign skeleton — premise, villain, three acts, a twist, and
            a climax — will appear here. Add an idea (or none) and hit{" "}
            <strong>Generate campaign plot</strong>.
          </>
        }
        extraActions={
          <button className="ghost" type="button" onClick={run}>
            Regenerate
          </button>
        }
        cta={
          <>
            Make it real — save the world, factions, and plot threads in a{" "}
            <Link href="/campaigns">persistent campaign →</Link> your tools
            remember.
          </>
        }
      />
    </div>
  );
}
