"use client";

// Long-form chapter writer: generate an outline, then stream each chapter into a
// growing manuscript, grounded in the outline + story so far. Talks to the same
// /api/generate-story route via mode:"outline" | "chapter".
import { useState } from "react";
import { downloadText, firstHeading, slugFilename } from "@/lib/download";
import { trackEvent } from "@/lib/track";

const GENRES = [
  "",
  "Fantasy",
  "Sci-fi",
  "Horror",
  "Mystery",
  "Adventure",
  "Romance",
  "Cyberpunk",
];
const TONES = [
  "",
  "Whimsical",
  "Dark",
  "Heroic",
  "Melancholic",
  "Suspenseful",
  "Hopeful",
];

async function streamRequest(
  body: Record<string, unknown>,
  onDelta: (text: string) => void,
): Promise<string> {
  const res = await fetch("/api/generate-story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 429)
    throw new Error("Free limit reached — wait a minute.");
  if (!res.ok || !res.body)
    throw new Error("Generation failed — please retry.");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let acc = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    acc += decoder.decode(value, { stream: true });
    onDelta(acc);
  }
  return acc;
}

function parseChapters(outline: string): string[] {
  return outline
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^\d+[.)]/.test(l))
    .map((l) => l.replace(/^\d+[.)]\s*/, ""));
}

export function LongStoryWriter() {
  const [idea, setIdea] = useState("");
  const [genre, setGenre] = useState("");
  const [tone, setTone] = useState("");
  const [count, setCount] = useState("6");

  const [outline, setOutline] = useState("");
  const [chapters, setChapters] = useState<string[]>([]);
  const [manuscript, setManuscript] = useState("");
  const [done, setDone] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function genOutline() {
    setBusy("outline");
    setError("");
    setOutline("");
    setChapters([]);
    setManuscript("");
    setDone(new Set());
    trackEvent("generate", { tool: "long-story:outline" });
    try {
      const text = await streamRequest(
        { mode: "outline", idea, genre, tone, chapters: count },
        setOutline,
      );
      setChapters(parseChapters(text));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate outline.");
    } finally {
      setBusy(null);
    }
  }

  async function writeChapter(idx: number) {
    setBusy(`ch-${idx}`);
    setError("");
    const base = manuscript ? `${manuscript}\n\n` : "";
    trackEvent("generate", { tool: "long-story:chapter" });
    try {
      await streamRequest(
        {
          mode: "chapter",
          genre,
          tone,
          outline,
          chapter: chapters[idx],
          continueFrom: manuscript,
        },
        (acc) => setManuscript(base + acc),
      );
      setDone((prev) => new Set(prev).add(idx));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not write chapter.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="tool" style={{ gridTemplateColumns: "0.8fr 1.2fr" }}>
      {/* Left: setup + outline + chapter list */}
      <div className="panel">
        <div className="field">
          <label htmlFor="ls-idea">Your idea (optional)</label>
          <textarea
            id="ls-idea"
            value={idea}
            maxLength={600}
            placeholder="A cartographer mapping an island that rearranges itself…"
            onChange={(e) => setIdea(e.target.value)}
          />
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="ls-genre">Genre</label>
            <select
              id="ls-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g || "Any"}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="ls-tone">Tone</label>
            <select
              id="ls-tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="ls-count">Chapters</label>
          <select
            id="ls-count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          >
            {["4", "5", "6", "7", "8"].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="actions">
          <button
            className="primary"
            type="button"
            onClick={genOutline}
            disabled={busy !== null}
          >
            {busy === "outline" ? "Outlining…" : "Generate outline"}
          </button>
        </div>

        {outline && (
          <>
            <h4 style={{ margin: "18px 0 6px" }}>Outline</h4>
            <textarea
              value={outline}
              onChange={(e) => {
                setOutline(e.target.value);
                setChapters(parseChapters(e.target.value));
              }}
              style={{ minHeight: 160 }}
            />
            <p className="statusline">
              Edit the outline if you like, then write each chapter.
            </p>
            <ol
              style={{
                margin: 0,
                paddingLeft: 18,
                color: "var(--muted)",
                lineHeight: 1.8,
              }}
            >
              {chapters.map((ch, idx) => (
                <li key={idx}>
                  {ch}{" "}
                  <button
                    className="ghost"
                    type="button"
                    style={{
                      padding: "4px 10px",
                      minHeight: "auto",
                      fontSize: 12,
                    }}
                    onClick={() => writeChapter(idx)}
                    disabled={busy !== null}
                  >
                    {busy === `ch-${idx}`
                      ? "Writing…"
                      : done.has(idx)
                        ? "Rewrite"
                        : "Write"}
                  </button>
                </li>
              ))}
            </ol>
          </>
        )}
        {error && (
          <div className="errorbox" style={{ marginTop: 12 }}>
            {error}
          </div>
        )}
      </div>

      {/* Right: manuscript */}
      <div className="panel" aria-live="polite">
        <p className="statusline">
          {manuscript ? "Manuscript" : "Your manuscript will build here"}
        </p>
        {!manuscript && (
          <p className="empty">
            Generate an outline on the left, then write chapters — each one
            appends here.
          </p>
        )}
        {manuscript && <div className="out">{manuscript}</div>}
        {manuscript && busy === null && (
          <div className="actions" style={{ marginTop: 14 }}>
            <button
              className="ghost"
              type="button"
              onClick={() =>
                navigator.clipboard.writeText(manuscript).catch(() => {})
              }
            >
              Copy
            </button>
            <button
              className="ghost"
              type="button"
              onClick={() =>
                downloadText(slugFilename(firstHeading(manuscript)), manuscript)
              }
            >
              Download .md
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
