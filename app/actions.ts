"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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
export async function saveNpcAction(input: SaveNpcInput): Promise<SaveNpcResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Campaign saving isn't set up yet (Supabase not configured)." };
  }
  if (!input.content?.trim()) {
    return { ok: false, error: "Nothing to save — generate an NPC first." };
  }
  const name = (input.campaignName || "My Campaign").trim().slice(0, 80) || "My Campaign";

  const supabase = await createServerSupabaseClient();

  // Ensure a session so RLS owner = auth.uid(). Anonymous sign-in = no signup friction.
  let userId: string | undefined = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error || !data.user) {
      return {
        ok: false,
        error: "Could not start a session. Enable Anonymous sign-ins in Supabase Auth settings.",
      };
    }
    userId = data.user.id;
  }

  // Find-or-create the campaign by (owner, name) — RLS already scopes to this user.
  const existing = await supabase
    .from("campaigns")
    .select("id")
    .eq("name", name)
    .limit(1)
    .maybeSingle();

  let campaignId = existing.data?.id as string | undefined;
  if (!campaignId) {
    const created = await supabase
      .from("campaigns")
      .insert({ name })
      .select("id")
      .single();
    if (created.error || !created.data) {
      return { ok: false, error: "Could not create the campaign." };
    }
    campaignId = created.data.id as string;
  }

  const inserted = await supabase
    .from("npcs")
    .insert({ campaign_id: campaignId, content: input.content, inputs: input.inputs });
  if (inserted.error) {
    return { ok: false, error: "Could not save the NPC." };
  }

  return { ok: true, campaignId };
}
