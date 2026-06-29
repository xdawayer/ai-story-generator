"use client";

// Client-side account control in the global header. Reading auth state on the
// client (not the server) keeps the tool pages statically rendered for SEO.
// Shows "Sign in" for guests/anonymous, or the email + "Sign out" once signed in.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function AccountMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  }

  // Anonymous users aren't "signed in" — prompt them to keep their data.
  const signedIn = ready && user && !user.is_anonymous;

  if (!signedIn) {
    return (
      <Link href="/login" className="nav-cta">
        Sign in
      </Link>
    );
  }

  return (
    <span className="account">
      <span className="account-email" title={user.email ?? ""}>
        {user.email}
      </span>
      <button className="ghost account-signout" type="button" onClick={signOut}>
        Sign out
      </button>
    </span>
  );
}
