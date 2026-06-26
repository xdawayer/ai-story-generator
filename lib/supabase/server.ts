// Server Supabase client (Server Components / Route Handlers / Server Actions).
// Pattern mirrored from gengrowth-agents/src/lib/supabase/server.ts.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll throws in a pure Server Component render — safe to ignore;
            // the middleware refreshes the session cookie instead.
          }
        },
      },
    },
  );
}
