"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { completion, isLlmConfigured } from "@/lib/llm";
import { buildRecapPrompt } from "@/lib/recap-prompt";
import { buildExtractCharactersPrompt } from "@/lib/extract-characters-prompt";

type ServerSupabase = Awaited<ReturnType<typeof createServerSupabaseClient>>;

// Ensure an (anonymous) session exists so RLS owner = auth.uid(). Returns the
// user id, or undefined if anonymous sign-in is unavailable. Shared by every
// write path (NPC save, story save, character extraction).
async function ensureSession(
  supabase: ServerSupabase,
): Promise<string | undefined> {
  const current = (await supabase.auth.getUser()).data.user?.id;
  if (current) return current;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) return undefined;
  return data.user.id;
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

// ---- Story funnel: save a generated story, and pull its characters into NPCs ----

export interface SaveStoryInput {
  campaignName: string;
  content: string;
  inputs: Record<string, string>;
}

export interface SaveStoryResult {
  ok: boolean;
  error?: string;
  campaignId?: string;
}

// Persist a generated story into a campaign owned by the (anonymous) user, so a
// one-off story becomes part of a world they return to.
export async function saveStoryAction(
  input: SaveStoryInput,
): Promise<SaveStoryResult> {
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

  const inserted = await supabase.from("stories").insert({
    campaign_id: campaignId,
    title: firstLineTitle(input.content),
    content: input.content,
    inputs: input.inputs ?? {},
  });
  if (inserted.error) {
    return { ok: false, error: "Could not save the story." };
  }

  revalidatePath("/stories");
  revalidatePath("/campaigns");
  return { ok: true, campaignId };
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
      error: "Character extraction isn't configured (set AZURE_OPENAI_*).",
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
        "Recap generation isn't configured (set AZURE_OPENAI_* in .env.local).",
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

  const [npcsRes, sessionsRes] = await Promise.all([
    supabase.from("npcs").select("content").eq("campaign_id", campaignId),
    supabase
      .from("sessions")
      .select("notes,created_at")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: true }),
  ]);

  const npcTitles = (npcsRes.data ?? []).map((n) =>
    firstLineTitle(n.content as string),
  );
  const sessionNotes = (sessionsRes.data ?? []).map((s) => s.notes as string);

  const { system, user } = buildRecapPrompt({
    campaignName: campaignRes.data.name as string,
    worldNote: (campaignRes.data.world_note as string) ?? "",
    npcTitles,
    sessionNotes,
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
