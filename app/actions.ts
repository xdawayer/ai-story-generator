"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { completion, isLlmConfigured } from "@/lib/llm";
import { buildRecapPrompt } from "@/lib/recap-prompt";
import { buildExtractCharactersPrompt } from "@/lib/extract-characters-prompt";
import { ensureProfile } from "@/lib/profile";
import { isWorldKind } from "@/lib/world-kinds";

type ServerSupabase = Awaited<ReturnType<typeof createServerSupabaseClient>>;

// Ensure an (anonymous) session exists so RLS owner = auth.uid(). Returns the
// user id, or undefined if anonymous sign-in is unavailable. Shared by every
// write path (NPC save, story save, character extraction).
async function ensureSession(
  supabase: ServerSupabase,
): Promise<string | undefined> {
  const current = (await supabase.auth.getUser()).data.user;
  if (current) {
    void ensureProfile(supabase, current);
    return current.id;
  }
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) return undefined;
  void ensureProfile(supabase, data.user);
  return data.user.id;
}

// Delete one owned row from a table by id. RLS already restricts to the owner,
// so a wrong id simply deletes nothing. Used by all the delete actions.
async function deleteOwnedRow(
  table:
    | "npcs"
    | "stories"
    | "sessions"
    | "campaigns"
    | "factions"
    | "locations"
    | "plot_threads",
  id: string,
): Promise<ActionResult> {
  if (!uuid.safeParse(id).success) {
    return { ok: false, error: "Invalid id." };
  }
  const setup = await requireSetup();
  if (!setup.ok) return setup;
  const res = await setup.supabase.from(table).delete().eq("id", id);
  if (res.error) return { ok: false, error: "Could not delete." };
  revalidatePath("/campaigns");
  revalidatePath("/stories");
  return { ok: true };
}

export async function deleteNpcAction(id: string): Promise<ActionResult> {
  return deleteOwnedRow("npcs", id);
}

export async function deleteStoryAction(id: string): Promise<ActionResult> {
  return deleteOwnedRow("stories", id);
}

export async function deleteSessionAction(id: string): Promise<ActionResult> {
  return deleteOwnedRow("sessions", id);
}

// Deletes the campaign and (via ON DELETE CASCADE) all its NPCs/stories/sessions.
export async function deleteCampaignAction(id: string): Promise<ActionResult> {
  return deleteOwnedRow("campaigns", id);
}

// ---- Structured world-building: factions / locations / plot threads ----

// Add one named world entry (faction/location/plot thread) to a campaign.
export async function addWorldEntryAction(
  kind: string,
  campaignId: string,
  name: string,
  note: string,
): Promise<ActionResult> {
  if (!isWorldKind(kind)) return { ok: false, error: "Unknown entry type." };
  if (!uuid.safeParse(campaignId).success) {
    return { ok: false, error: "Invalid campaign." };
  }
  const parsedName = z.string().trim().min(1).max(120).safeParse(name);
  if (!parsedName.success) {
    return { ok: false, error: "Name is required (1-120 chars)." };
  }
  const parsedNote = z.string().max(2000).safeParse(note);
  if (!parsedNote.success) {
    return { ok: false, error: "Note is too long (2000 char max)." };
  }
  const setup = await requireSetup();
  if (!setup.ok) return setup;
  const res = await setup.supabase.from(kind).insert({
    campaign_id: campaignId,
    name: parsedName.data,
    note: parsedNote.data,
  });
  if (res.error) return { ok: false, error: "Could not add the entry." };
  revalidatePath("/campaigns");
  return { ok: true };
}

export async function deleteWorldEntryAction(
  kind: string,
  id: string,
): Promise<ActionResult> {
  if (!isWorldKind(kind)) return { ok: false, error: "Unknown entry type." };
  return deleteOwnedRow(kind, id);
}

// Rename a saved story's title.
export async function updateStoryTitleAction(
  id: string,
  title: string,
): Promise<ActionResult> {
  if (!uuid.safeParse(id).success) {
    return { ok: false, error: "Invalid story." };
  }
  const parsed = z.string().trim().min(1).max(120).safeParse(title);
  if (!parsed.success) {
    return { ok: false, error: "Title must be 1-120 characters." };
  }
  const setup = await requireSetup();
  if (!setup.ok) return setup;
  const res = await setup.supabase
    .from("stories")
    .update({ title: parsed.data })
    .eq("id", id);
  if (res.error) return { ok: false, error: "Could not rename the story." };
  revalidatePath("/stories");
  revalidatePath("/campaigns");
  return { ok: true };
}

// Find-or-create a campaign by (owner, name). RLS already scopes to this user.
async function findOrCreateCampaign(
  supabase: ServerSupabase,
  rawName: string,
): Promise<string | undefined> {
  const name = (rawName || "My Campaign").trim().slice(0, 80) || "My Campaign";
  const existing = await supabase
    .from("campaigns")
    .select("id")
    .eq("name", name)
    .limit(1)
    .maybeSingle();
  if (existing.data?.id) return existing.data.id as string;
  const created = await supabase
    .from("campaigns")
    .insert({ name })
    .select("id")
    .single();
  if (created.error || !created.data) return undefined;
  return created.data.id as string;
}

export interface SaveNpcInput {
  campaignName: string;
  content: string;
  inputs: Record<string, string>;
}

export interface SaveNpcResult {
  ok: boolean;
  error?: string;
  campaignId?: string;
}

// Persist a generated NPC into a campaign owned by the (anonymous) user.
// This is the wedge: a saved world the user comes back to.
export async function saveNpcAction(
  input: SaveNpcInput,
): Promise<SaveNpcResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Campaign saving isn't set up yet (Supabase not configured).",
    };
  }
  if (!input.content?.trim()) {
    return { ok: false, error: "Nothing to save — generate an NPC first." };
  }

  const supabase = await createServerSupabaseClient();
  const userId = await ensureSession(supabase);
  if (!userId) {
    return {
      ok: false,
      error:
        "Could not start a session. Enable Anonymous sign-ins in Supabase Auth settings.",
    };
  }

  const campaignId = await findOrCreateCampaign(supabase, input.campaignName);
  if (!campaignId) {
    return { ok: false, error: "Could not create the campaign." };
  }

  const inserted = await supabase.from("npcs").insert({
    campaign_id: campaignId,
    content: input.content,
    inputs: input.inputs,
  });
  if (inserted.error) {
    return { ok: false, error: "Could not save the NPC." };
  }

  revalidatePath("/campaigns");
  return { ok: true, campaignId };
}

// Join the Pro waitlist (insert-only; no payment yet). Idempotent on email.
export async function joinWaitlistAction(email: string): Promise<ActionResult> {
  const parsed = z.email().max(200).safeParse(email);
  if (!parsed.success) return { ok: false, error: "Enter a valid email." };
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Waitlist isn't set up yet." };
  }
  const supabase = await createServerSupabaseClient();
  const res = await supabase
    .from("waitlist")
    .upsert(
      { email: parsed.data.toLowerCase() },
      { onConflict: "email", ignoreDuplicates: true },
    );
  if (res.error) return { ok: false, error: "Could not join — please retry." };
  return { ok: true };
}

// ---- Story funnel: save a generated story, and pull its characters into NPCs ----

export interface SaveStoryElementsInput {
  characters: { name: string; role?: string }[];
  locations: { name: string }[];
  plotHooks: string[];
}

export interface SaveStoryWithElementsInput {
  campaignName: string;
  content: string;
  inputs: Record<string, string>;
  elements: SaveStoryElementsInput;
}

export interface SaveStoryWithElementsResult {
  ok: boolean;
  error?: string;
  campaignId?: string;
  added?: {
    stories: number;
    characters: number;
    locations: number;
    plotHooks: number;
  };
}

// Truncate a label to `max` chars on a word boundary, adding an ellipsis. Used
// so a long element string becomes a clean single-line campaign entry rather
// than a mid-word cut.
function truncateLabel(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

// Insert rows best-effort and report how many landed (0 on empty or error), so a
// single failing element category never blocks the rest of the save.
async function insertCount(
  supabase: ServerSupabase,
  table: "npcs" | "locations" | "plot_threads",
  rows: Record<string, unknown>[],
): Promise<number> {
  if (rows.length === 0) return 0;
  const res = await supabase.from(table).insert(rows);
  return res.error ? 0 : rows.length;
}

// Save a generated story AND its extracted structure into a campaign in one shot:
// the story, its named characters (as NPCs), its locations, and its plot hooks
// (as plot threads). Returns per-category counts so the UI can show a concrete
// "Added: 1 story, 3 characters…" ownership summary — the payoff that turns a
// one-off story into a world the user owns. Element inserts are best-effort: the
// story always saves even if a category is empty or fails.
export async function saveStoryWithElementsAction(
  input: SaveStoryWithElementsInput,
): Promise<SaveStoryWithElementsResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Saving isn't set up yet (Supabase not configured).",
    };
  }
  if (!input.content?.trim()) {
    return { ok: false, error: "Nothing to save — generate a story first." };
  }

  const supabase = await createServerSupabaseClient();
  const userId = await ensureSession(supabase);
  if (!userId) {
    return {
      ok: false,
      error:
        "Could not start a session. Enable Anonymous sign-ins in Supabase Auth settings.",
    };
  }

  const campaignId = await findOrCreateCampaign(supabase, input.campaignName);
  if (!campaignId) {
    return { ok: false, error: "Could not create the campaign." };
  }

  const storyRes = await supabase.from("stories").insert({
    campaign_id: campaignId,
    title: firstLineTitle(input.content),
    content: input.content,
    inputs: input.inputs ?? {},
  });
  if (storyRes.error) {
    return { ok: false, error: "Could not save the story." };
  }

  const el = input.elements ?? { characters: [], locations: [], plotHooks: [] };

  // Named characters -> lightweight NPC cards. ("Extract NPCs" fleshes these out
  // with a full LLM pass when the user wants richer stat-block-style entries.)
  const npcRows = (el.characters ?? [])
    .map((c) => ({
      name: (c?.name ?? "").trim().slice(0, 120),
      role: (c?.role ?? "").trim().slice(0, 200),
    }))
    .filter((c) => c.name)
    .map((c) => ({
      campaign_id: campaignId,
      content: c.role ? `## ${c.name}\n\n**Role:** ${c.role}` : `## ${c.name}`,
      inputs: { source: "story" },
    }));
  const characters = await insertCount(supabase, "npcs", npcRows);

  // Locations -> location rows.
  const locationRows = (el.locations ?? [])
    .map((l) => (l?.name ?? "").trim())
    .filter(Boolean)
    .map((name) => ({
      campaign_id: campaignId,
      name: truncateLabel(name, 120),
      note: "",
    }));
  const locations = await insertCount(supabase, "locations", locationRows);

  // Plot hooks -> plot thread rows. The hook itself is the whole content, and the
  // campaign UI renders "name — note", so put the (word-boundary truncated) hook
  // in name and leave note empty — no duplicated prefix, no mid-word cut.
  const plotRows = (el.plotHooks ?? [])
    .map((h) => (h ?? "").trim())
    .filter(Boolean)
    .map((hook) => ({
      campaign_id: campaignId,
      name: truncateLabel(hook, 120),
      note: "",
    }));
  const plotHooks = await insertCount(supabase, "plot_threads", plotRows);

  revalidatePath("/stories");
  revalidatePath("/campaigns");
  return {
    ok: true,
    campaignId,
    added: { stories: 1, characters, locations, plotHooks },
  };
}

export interface ExtractCharactersInput {
  campaignName: string;
  story: string;
}

export interface ExtractCharactersResult {
  ok: boolean;
  error?: string;
  campaignId?: string;
  count?: number;
}

// Read a generated story, extract its named characters as NPCs, and save them
// into a campaign. This turns the story->campaign funnel into a real action.
export async function extractCharactersAction(
  input: ExtractCharactersInput,
): Promise<ExtractCharactersResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Saving isn't set up yet (Supabase not configured).",
    };
  }
  if (!isLlmConfigured()) {
    return {
      ok: false,
      error: "Character extraction isn't configured (set DEEPSEEK_API_KEY).",
    };
  }
  if (!input.story?.trim()) {
    return { ok: false, error: "Nothing to read — generate a story first." };
  }

  const supabase = await createServerSupabaseClient();
  const userId = await ensureSession(supabase);
  if (!userId) {
    return {
      ok: false,
      error:
        "Could not start a session. Enable Anonymous sign-ins in Supabase Auth settings.",
    };
  }

  const { system, user } = buildExtractCharactersPrompt(
    input.story.slice(0, 8000),
  );

  let raw: string;
  try {
    raw = await completion({ system, prompt: user, maxTokens: 1200 });
  } catch {
    return { ok: false, error: "Could not extract characters — please retry." };
  }

  // Split on a line that is only dashes; keep blocks that actually contain an NPC.
  const blocks = raw
    .split(/\n-{3,}\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 40 && b.includes("##"));
  if (blocks.length === 0) {
    return {
      ok: false,
      error: "No named characters found in this story.",
    };
  }

  const campaignId = await findOrCreateCampaign(supabase, input.campaignName);
  if (!campaignId) {
    return { ok: false, error: "Could not create the campaign." };
  }

  const rows = blocks.map((content) => ({
    campaign_id: campaignId,
    content,
    inputs: { source: "story" },
  }));
  const inserted = await supabase.from("npcs").insert(rows);
  if (inserted.error) {
    return { ok: false, error: "Could not save the characters." };
  }

  revalidatePath("/campaigns");
  return { ok: true, campaignId, count: blocks.length };
}

// ---- Campaign workspace v1: world note, session log, grounded recap ----

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const uuid = z.uuid();

// A mutation only makes sense for an existing (anonymous) owner; RLS already
// scopes rows, so a missing/new user simply owns nothing.
async function requireSetup(): Promise<
  | {
      ok: true;
      supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
    }
  | { ok: false; error: string }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Campaign saving isn't set up yet (Supabase not configured).",
    };
  }
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return {
      ok: false,
      error: "No session yet — save an NPC first to start a campaign.",
    };
  }
  return { ok: true, supabase };
}

function firstLineTitle(content: string): string {
  const line = content.split("\n").find((l) => l.trim().length > 0) ?? "NPC";
  return (
    line
      .replace(/^#+\s*/, "")
      .trim()
      .slice(0, 90) || "NPC"
  );
}

// Edit the campaign's world/setting note (the bible every generation grounds in).
export async function updateWorldNoteAction(
  campaignId: string,
  worldNote: string,
): Promise<ActionResult> {
  if (!uuid.safeParse(campaignId).success) {
    return { ok: false, error: "Invalid campaign." };
  }
  const note = z.string().max(4000).safeParse(worldNote);
  if (!note.success) {
    return { ok: false, error: "World note is too long (4000 char max)." };
  }
  const setup = await requireSetup();
  if (!setup.ok) return setup;

  const res = await setup.supabase
    .from("campaigns")
    .update({ world_note: note.data })
    .eq("id", campaignId);
  if (res.error) return { ok: false, error: "Could not save the world note." };

  revalidatePath("/campaigns");
  return { ok: true };
}

// Log one play-session (manual notes of what happened).
export async function addSessionAction(
  campaignId: string,
  notes: string,
): Promise<ActionResult> {
  if (!uuid.safeParse(campaignId).success) {
    return { ok: false, error: "Invalid campaign." };
  }
  const parsed = z.string().trim().min(1).max(4000).safeParse(notes);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Add a few words about what happened (4000 char max).",
    };
  }
  const setup = await requireSetup();
  if (!setup.ok) return setup;

  const res = await setup.supabase
    .from("sessions")
    .insert({ campaign_id: campaignId, notes: parsed.data });
  if (res.error)
    return { ok: false, error: "Could not save the session note." };

  revalidatePath("/campaigns");
  return { ok: true };
}

export interface RecapResult extends ActionResult {
  recap?: string;
}

// Generate a "previously on…" recap GROUNDED in this campaign's saved state.
// This is the wedge: a generation only possible because the world is remembered.
export async function generateRecapAction(
  campaignId: string,
): Promise<RecapResult> {
  if (!uuid.safeParse(campaignId).success) {
    return { ok: false, error: "Invalid campaign." };
  }
  if (!isLlmConfigured()) {
    return {
      ok: false,
      error:
        "Recap generation isn't configured (set DEEPSEEK_API_KEY in .env.local).",
    };
  }
  const setup = await requireSetup();
  if (!setup.ok) return setup;
  const { supabase } = setup;

  const campaignRes = await supabase
    .from("campaigns")
    .select("name,world_note")
    .eq("id", campaignId)
    .maybeSingle();
  if (campaignRes.error || !campaignRes.data) {
    return { ok: false, error: "Campaign not found." };
  }

  const worldName = (r: { name: string; note: string }) =>
    r.note ? `${r.name} (${r.note})` : r.name;

  const [npcsRes, sessionsRes, factionsRes, locationsRes, threadsRes] =
    await Promise.all([
      supabase.from("npcs").select("content").eq("campaign_id", campaignId),
      supabase
        .from("sessions")
        .select("notes,created_at")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: true }),
      supabase
        .from("factions")
        .select("name,note")
        .eq("campaign_id", campaignId),
      supabase
        .from("locations")
        .select("name,note")
        .eq("campaign_id", campaignId),
      supabase
        .from("plot_threads")
        .select("name,note")
        .eq("campaign_id", campaignId),
    ]);

  const npcTitles = (npcsRes.data ?? []).map((n) =>
    firstLineTitle(n.content as string),
  );
  const sessionNotes = (sessionsRes.data ?? []).map((s) => s.notes as string);
  const toNames = (rows: unknown) =>
    ((rows as { name: string; note: string }[]) ?? []).map(worldName);

  const { system, user } = buildRecapPrompt({
    campaignName: campaignRes.data.name as string,
    worldNote: (campaignRes.data.world_note as string) ?? "",
    npcTitles,
    sessionNotes,
    factions: toNames(factionsRes.data),
    locations: toNames(locationsRes.data),
    plotThreads: toNames(threadsRes.data),
  });

  try {
    const recap = await completion({ system, prompt: user, maxTokens: 500 });
    if (!recap)
      return { ok: false, error: "The recap came back empty — please retry." };
    return { ok: true, recap };
  } catch {
    return { ok: false, error: "Could not generate the recap — please retry." };
  }
}
