// Browser Supabase client (Client Components). Pattern mirrored from
// gengrowth-agents/src/lib/supabase/client.ts.
import { createBrowserClient } from "@supabase/ssr";

function requireEnv(name: string, raw: string | undefined): string {
  const v = raw?.trim();
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function createClient() {
  return createBrowserClient(
    requireEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    requireEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    // Shared host project, isolated in the `storygen` schema (see server.ts).
    { db: { schema: "storygen" } },
  );
}
