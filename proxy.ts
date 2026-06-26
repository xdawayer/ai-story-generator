// Next.js 16 request proxy (formerly middleware.ts). Refreshes the Supabase
// session on navigation; no-ops when Supabase isn't configured.
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // All routes except static assets and the generation API (which is anonymous).
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
