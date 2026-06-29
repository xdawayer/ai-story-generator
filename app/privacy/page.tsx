import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — AI Story Generator",
  description:
    "How AI Story Generator handles your data: what we collect, why, the third parties involved, and your choices.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Privacy
          </div>
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: June 29, 2026</p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 32 }}>
        <div style={{ maxWidth: 760 }}>
          <p className="lead">
            This policy explains what AI Story Generator collects, why, and who
            we share it with. We aim to collect as little as possible.
          </p>

          <h2 style={{ marginTop: 28 }}>What we collect</h2>
          <ul style={{ color: "var(--muted)", lineHeight: 1.8 }}>
            <li>
              <strong>Prompts and generated content.</strong> The inputs you
              submit to a generator are sent to our AI provider to produce a
              result. If you save content, it&apos;s stored against your account.
            </li>
            <li>
              <strong>Account data.</strong> If you sign in, we store an account
              identifier and, for email or Google sign-in, your email address.
              You can use the free tools anonymously without an account.
            </li>
            <li>
              <strong>Technical data.</strong> We temporarily process your IP
              address to rate-limit abuse, and use privacy-friendly,
              cookieless analytics to understand aggregate usage.
            </li>
          </ul>

          <h2 style={{ marginTop: 28 }}>How we use it</h2>
          <p className="lead">
            To generate the content you ask for, to save and show you your own
            campaigns and stories, to prevent abuse, and to improve the service.
            We do not sell your personal data.
          </p>

          <h2 style={{ marginTop: 28 }}>Third parties</h2>
          <p className="lead">
            We rely on a small number of processors to run the service: a
            hosting/CDN provider, a managed database and authentication provider,
            and a third-party AI provider that generates the text. Your prompts
            are processed by the AI provider solely to return your result.
          </p>

          <h2 style={{ marginTop: 28 }}>Retention</h2>
          <p className="lead">
            Saved content is kept until you delete it or close your account.
            Rate-limit and analytics data is short-lived and aggregated.
          </p>

          <h2 style={{ marginTop: 28 }}>Your choices</h2>
          <p className="lead">
            You can use the tools without an account, delete any saved item from
            your <Link href="/campaigns">campaigns</Link> and{" "}
            <Link href="/stories">stories</Link>, and request deletion of your
            account data. Contact us for any privacy request.
          </p>

          <h2 style={{ marginTop: 28 }}>Changes</h2>
          <p className="lead">
            We may update this policy; material changes will be reflected by the
            date above. Continued use means you accept the current version.
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 28 }}>
          <Link href="/">← Home</Link> · <Link href="/terms">Terms</Link>
        </p>
      </section>
    </main>
  );
}
