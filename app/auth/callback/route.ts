// OAuth / magic-link / email-change return handler. Exchanges the code (or
// verifies the OTP token hash) for a session, ensures a profile row, then
// redirects on. Works for sign-in, Google OAuth, and anonymous-account upgrade.
import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/profile";

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") || "/campaigns";

  const supabase = await createServerSupabaseClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else if (tokenHash && type) {
    await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  }

  const { data } = await supabase.auth.getUser();
  if (data.user) await ensureProfile(supabase, data.user);

  return NextResponse.redirect(new URL(next, origin));
}
