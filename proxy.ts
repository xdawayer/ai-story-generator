// Next.js 16 request proxy (formerly middleware.ts). Two jobs:
//   1. Rewrite owned short-link codes (/q1abc123 -> /go/q1abc123) for link attribution.
//   2. Otherwise refresh the Supabase session on navigation; no-ops when Supabase isn't configured.
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Bare short codes are 6-80 chars of [a-z0-9-] AND must contain a digit. The
// link-attribution tool always generates codes like `q1<hash>` (digit-bearing),
// so this guard makes collisions with word-like routes effectively impossible.
const ROOT_SHORT_CODE_PATH = /^\/([a-z0-9-]{6,80})$/i;
const HAS_DIGIT = /[0-9]/;

// Real top-level routes of this app — never treat these as short codes.
const RESERVED_ROOT_PATHS = new Set([
  "about",
  "ai-story-generator",
  "api",
  "auth",
  "blog",
  "campaigns",
  "dnd-story-generator",
  "go",
  "login",
  "long-story-generator",
  "pricing",
  "privacy",
  "rpg-tools",
  "stories",
  "story-generators",
  "terms",
]);

function rootShortCode(pathname: string): string | null {
  const match = pathname.match(ROOT_SHORT_CODE_PATH);
  if (!match) return null;
  const code = match[1].toLowerCase();
  if (!HAS_DIGIT.test(code) || RESERVED_ROOT_PATHS.has(code)) return null;
  return code;
}

export async function proxy(request: NextRequest) {
  const code = rootShortCode(request.nextUrl.pathname);
  if (code) {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/go/${code}`;
    return NextResponse.rewrite(rewritten);
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    // All routes except static assets and the generation API (which is anonymous).
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
