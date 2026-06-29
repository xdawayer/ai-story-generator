// Lazily ensure a profile row exists for a user (carries subscription tier).
// Called after sign-in and on first save. Only sets id+email on conflict, so an
// existing tier is never clobbered.
import type { User } from "@supabase/supabase-js";
import type { createServerSupabaseClient } from "@/lib/supabase/server";

type ServerSupabase = Awaited<ReturnType<typeof createServerSupabaseClient>>;

export async function ensureProfile(
  supabase: ServerSupabase,
  user: Pick<User, "id" | "email"> | null | undefined,
): Promise<void> {
  if (!user) return;
  await supabase
    .from("profiles")
    .upsert({ id: user.id, email: user.email ?? null }, { onConflict: "id" });
}
