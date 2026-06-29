"use client";

// Interactive workspace for one saved campaign: edit the world note, log play
// sessions, generate a grounded recap, and export the whole campaign to Markdown.
// Server data comes in as plain props; all mutations go through server actions.
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addSessionAction,
  deleteCampaignAction,
  deleteNpcAction,
  deleteSessionAction,
  deleteStoryAction,
  generateRecapAction,
  updateWorldNoteAction,
} from "@/app/actions";
import { downloadText, slugFilename } from "@/lib/download";
import { ConfirmButton } from "@/components/confirm-button";
import { WorldSection, type WorldEntry } from "./world-section";

export interface NpcItem {
  id: string;
  content: string;
}
export interface SessionItem {
  id: string;
  notes: string;
  created_at: string;
}
export interface StoryItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
}
export interface CampaignData {
  id: string;
  name: string;
  world_note: string;
  npcs: NpcItem[];
  sessions: SessionItem[];
  stories: StoryItem[];
  factions: WorldEntry[];
  locations: WorldEntry[];
  plotThreads: WorldEntry[];
}

function npcTitle(content: string): string {
  const line = content.split("\n").find((l) => l.trim().length > 0) ?? "NPC";
  return (
    line
      .replace(/^#+\s*/, "")
      .trim()
      .slice(0, 90) || "NPC"
  );
}

function buildMarkdown(c: CampaignData): string {
  const parts = [`# ${c.name}`, ""];
  if (c.world_note.trim()) {
    parts.push("## World", c.world_note.trim(), "");
  }
  if (c.npcs.length > 0) {
    parts.push("## NPCs", "");
    for (const n of c.npcs) parts.push(n.content.trim(), "", "---", "");
  }
  if (c.sessions.length > 0) {
    parts.push("## Session log", "");
    c.sessions.forEach((s, i) => {
      const date = s.created_at.slice(0, 10);
      parts.push(`### Session ${i + 1} — ${date}`, s.notes.trim(), "");
    });
  }
  const worldBlock = (title: string, items: WorldEntry[]) => {
    if (items.length === 0) return;
    parts.push(`## ${title}`, "");
    for (const it of items) {
      parts.push(`- **${it.name}**${it.note ? ` — ${it.note}` : ""}`);
    }
    parts.push("");
  };
  worldBlock("Factions", c.factions);
  worldBlock("Locations", c.locations);
  worldBlock("Plot threads", c.plotThreads);
  if (c.stories.length > 0) {
    parts.push("## Stories", "");
    for (const s of c.stories) parts.push(s.content.trim(), "", "---", "");
  }
  return parts.join("\n");
}

export function CampaignCard({ campaign }: { campaign: CampaignData }) {
  const router = useRouter();
  const [worldNote, setWorldNote] = useState(campaign.world_note);
  const [worldMsg, setWorldMsg] = useState("");
  const [savingWorld, setSavingWorld] = useState(false);

  const [newNotes, setNewNotes] = useState("");
  const [addingSession, setAddingSession] = useState(false);
  const [sessionMsg, setSessionMsg] = useState("");

  const [recap, setRecap] = useState("");
  const [recapLoading, setRecapLoading] = useState(false);
  const [recapErr, setRecapErr] = useState("");

  async function saveWorld() {
    setSavingWorld(true);
    setWorldMsg("");
    const res = await updateWorldNoteAction(campaign.id, worldNote);
    setSavingWorld(false);
    setWorldMsg(
      res.ok ? "World note saved." : (res.error ?? "Could not save."),
    );
  }

  async function addSession() {
    if (!newNotes.trim()) return;
    setAddingSession(true);
    setSessionMsg("");
    const res = await addSessionAction(campaign.id, newNotes);
    setAddingSession(false);
    if (res.ok) {
      setNewNotes("");
      setSessionMsg("Session logged.");
    } else {
      setSessionMsg(res.error ?? "Could not save.");
    }
  }

  async function makeRecap() {
    setRecapLoading(true);
    setRecapErr("");
    setRecap("");
    const res = await generateRecapAction(campaign.id);
    setRecapLoading(false);
    if (res.ok && res.recap) setRecap(res.recap);
    else setRecapErr(res.error ?? "Could not generate the recap.");
  }

  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>{campaign.name}</h3>
        <div className="actions" style={{ margin: 0 }}>
          <button
            className="ghost"
            type="button"
            onClick={() =>
              downloadText(slugFilename(campaign.name), buildMarkdown(campaign))
            }
          >
            Export Markdown
          </button>
          <ConfirmButton
            label="Delete campaign"
            confirmLabel="Confirm delete"
            onConfirm={async () => {
              await deleteCampaignAction(campaign.id);
              router.refresh();
            }}
          />
        </div>
      </div>

      {/* World note */}
      <div className="field" style={{ marginTop: 12 }}>
        <label htmlFor={`world-${campaign.id}`}>World / setting note</label>
        <textarea
          id={`world-${campaign.id}`}
          value={worldNote}
          maxLength={4000}
          placeholder="The kingdom, the central conflict, the tone — what every generation should fit."
          onChange={(e) => setWorldNote(e.target.value)}
        />
      </div>
      <div className="actions">
        <button
          className="ghost"
          type="button"
          onClick={saveWorld}
          disabled={savingWorld}
        >
          {savingWorld ? "Saving…" : "Save world note"}
        </button>
        {worldMsg && <span className="statusline">{worldMsg}</span>}
      </div>

      {/* NPCs */}
      <h4 style={{ margin: "18px 0 6px" }}>NPCs</h4>
      {campaign.npcs.length === 0 ? (
        <p className="empty">No NPCs saved here yet.</p>
      ) : (
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            color: "var(--muted)",
            lineHeight: 1.7,
          }}
        >
          {campaign.npcs.map((n) => (
            <li key={n.id}>
              <span style={{ marginRight: 8 }}>{npcTitle(n.content)}</span>
              <ConfirmButton
                label="✕"
                confirmLabel="Delete?"
                onConfirm={async () => {
                  await deleteNpcAction(n.id);
                  router.refresh();
                }}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Stories */}
      <h4 style={{ margin: "18px 0 6px" }}>Stories</h4>
      {campaign.stories.length === 0 ? (
        <p className="empty">No stories saved here yet.</p>
      ) : (
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            color: "var(--muted)",
            lineHeight: 1.7,
          }}
        >
          {campaign.stories.map((s) => (
            <li key={s.id}>
              <span style={{ marginRight: 8 }}>
                {s.title || "Untitled story"}{" "}
                <span className="statusline">
                  — {s.created_at.slice(0, 10)}
                </span>
              </span>
              <ConfirmButton
                label="✕"
                confirmLabel="Delete?"
                onConfirm={async () => {
                  await deleteStoryAction(s.id);
                  router.refresh();
                }}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Structured world-building */}
      <WorldSection
        campaignId={campaign.id}
        kind="factions"
        items={campaign.factions}
      />
      <WorldSection
        campaignId={campaign.id}
        kind="locations"
        items={campaign.locations}
      />
      <WorldSection
        campaignId={campaign.id}
        kind="plot_threads"
        items={campaign.plotThreads}
      />

      {/* Session log */}
      <h4 style={{ margin: "18px 0 6px" }}>Session log</h4>
      {campaign.sessions.length === 0 ? (
        <p className="empty">No sessions logged yet.</p>
      ) : (
        <ol
          style={{
            margin: 0,
            paddingLeft: 18,
            color: "var(--muted)",
            lineHeight: 1.7,
          }}
        >
          {campaign.sessions.map((s) => (
            <li key={s.id}>
              <strong>{s.created_at.slice(0, 10)}</strong> — {s.notes}{" "}
              <ConfirmButton
                label="✕"
                confirmLabel="Delete?"
                onConfirm={async () => {
                  await deleteSessionAction(s.id);
                  router.refresh();
                }}
              />
            </li>
          ))}
        </ol>
      )}
      <div className="field" style={{ marginTop: 10 }}>
        <label htmlFor={`session-${campaign.id}`}>Log a session</label>
        <textarea
          id={`session-${campaign.id}`}
          value={newNotes}
          maxLength={4000}
          placeholder="What happened this session — who they met, what they decided, what's unresolved."
          onChange={(e) => setNewNotes(e.target.value)}
        />
      </div>
      <div className="actions">
        <button
          className="ghost"
          type="button"
          onClick={addSession}
          disabled={addingSession || !newNotes.trim()}
        >
          {addingSession ? "Saving…" : "Add session"}
        </button>
        {sessionMsg && <span className="statusline">{sessionMsg}</span>}
      </div>

      {/* Grounded recap */}
      <h4 style={{ margin: "18px 0 6px" }}>Recap</h4>
      <p className="statusline" style={{ marginTop: 0 }}>
        Generate a &ldquo;previously on…&rdquo; recap grounded in this
        campaign&apos;s world, NPCs, and session log.
      </p>
      <div className="actions">
        <button
          className="primary"
          type="button"
          onClick={makeRecap}
          disabled={recapLoading}
        >
          {recapLoading ? "Writing recap…" : "Generate recap"}
        </button>
      </div>
      {recapErr && <div className="errorbox">{recapErr}</div>}
      {recap && <div className="out">{recap}</div>}
    </div>
  );
}
