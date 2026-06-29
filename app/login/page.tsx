import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — AI Story Generator",
  description:
    "Sign in to keep your campaigns, NPCs, and stories across devices.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="hero wrap">
      <div className="eyebrow">
        <span className="dot" /> Keep your world across devices
      </div>
      <h1>Sign in</h1>
      <p className="lead">
        Save your campaigns, NPCs, and stories to your account so they&apos;re
        there on any device. Already generated things as a guest? Signing in
        keeps everything you&apos;ve made.
      </p>
      <div style={{ maxWidth: 420, marginTop: 22 }}>
        <LoginForm />
      </div>
      <p className="lead" style={{ fontSize: 14, marginTop: 20 }}>
        <Link href="/">← Back to all tools</Link>
      </p>
    </main>
  );
}
