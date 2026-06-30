// @input  -- @supabase/supabase-js, env SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL
// @output -- createAdminSupabaseClient() bypasses RLS for server-only admin operations
// @pos    -- Admin layer, used by link-attribution short-link registration + /go redirects
import { createClient } from "@supabase/supabase-js";

function normalizeEnv(raw: string | undefined): string {
  return raw?.replace(/\\n/g, "").trim() ?? "";
}

export function createAdminSupabaseClient() {
  const url = normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceKey = normalizeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "Set these environment variables to use admin operations.",
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
