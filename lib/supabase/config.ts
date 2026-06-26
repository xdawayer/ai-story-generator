// Single source of truth for whether the campaign-persistence layer is wired.
// Until a Supabase project is created and these env vars are set, the app runs
// fully (free NPC generator) with campaign saving gracefully disabled.
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}
