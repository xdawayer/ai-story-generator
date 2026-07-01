"use client";

// Interactive workspace for one saved campaign: edit the world note, browse
// expandable NPC / story cards, keep structured world-building, log play
// sessions, generate a grounded recap, and export the whole campaign to
// Markdown. Server data comes in as plain props; all mutations go through
// server actions.
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addSessionAction,
  deleteCampaignAction,
  deleteSessionAction,
  generateRecapAction,
  updateWorldNoteAction,
} from "@/app/actions";
import { downloadText, slugFilename } from "@/lib/download";
import { ConfirmButton } from "@/components/confirm-button";
import { Markdown } from "@/components/markdown";
import { WorldSection, type WorldEntry } from "./world-section";
import { Section } from "./section";
import { NpcCard } from "./npc-card";
import { StoryCard } from "./story-card";

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
    <div className="panel campaign" style={{ marginBottom: 16 }}>
      <div className="campaign-head">
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
      <Section title="NPCs" count={campaign.npcs.length}>
        {campaign.npcs.length === 0 ? (
          <p className="empty">No NPCs saved here yet.</p>
        ) : (
          <div className="entry-list">
            {campaign.npcs.map((n) => (
              <NpcCard key={n.id} id={n.id} content={n.content} />
            ))}
          </div>
        )}
      </Section>

      {/* Stories */}
      <Section title="Stories" count={campaign.stories.length}>
        {campaign.stories.length === 0 ? (
          <p className="empty">No stories saved here yet.</p>
        ) : (
          <div className="entry-list">
            {campaign.stories.map((s) => (
              <StoryCard
                key={s.id}
                id={s.id}
                title={s.title}
                content={s.content}
                createdAt={s.created_at}
              />
            ))}
          </div>
        )}
      </Section>

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
      <Section title="Session log" count={campaign.sessions.length}>
        {campaign.sessions.length === 0 ? (
          <p className="empty">No sessions logged yet.</p>
        ) : (
          <ol className="session-list">
            {campaign.sessions.map((s) => (
              <li key={s.id} className="session-entry">
                <div className="session-entry-head">
                  <strong>{s.created_at.slice(0, 10)}</strong>
                  <ConfirmButton
                    label="✕"
                    confirmLabel="Delete?"
                    onConfirm={async () => {
                      await deleteSessionAction(s.id);
                      router.refresh();
                    }}
                  />
                </div>
                <p className="session-entry-notes">{s.notes}</p>
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
      </Section>

      {/* Grounded recap */}
      <Section title="Recap" count={undefined}>
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
        {recap && (
          <div className="out" style={{ marginTop: 12 }}>
            <Markdown text={recap} />
          </div>
        )}
      </Section>
    </div>
  );
}
