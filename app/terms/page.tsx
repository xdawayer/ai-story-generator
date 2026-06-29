import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — AI Story Generator",
  description:
    "The terms for using AI Story Generator: your content, acceptable use, and the usual disclaimers.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main>
      <section className="hero-band">
        <div className="wrap">
          <div className="eyebrow">
            <span className="dot" /> Terms
          </div>
          <h1>Terms of Service</h1>
          <p className="lead">Last updated: June 29, 2026</p>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28, paddingBottom: 32 }}>
        <div style={{ maxWidth: 760 }}>
          <p className="lead">
            By using AI Story Generator you agree to these terms. If you
            don&apos;t agree, please don&apos;t use the service.
          </p>

          <h2 style={{ marginTop: 28 }}>The service</h2>
          <p className="lead">
            AI Story Generator provides free, AI-assisted generators for tabletop
            RPG content and stories, plus optional accounts to save your work. We
            may change, suspend, or discontinue features at any time.
          </p>

          <h2 style={{ marginTop: 28 }}>Your content</h2>
          <p className="lead">
            The output a generator produces for you is yours to use, including
            commercially. We ask the model to avoid imitating copyrighted
            franchises, but generated content is provided as-is — review it
            before publishing. You&apos;re responsible for the inputs you submit
            and for ensuring your use is lawful.
          </p>

          <h2 style={{ marginTop: 28 }}>Acceptable use</h2>
          <p className="lead">
            Don&apos;t use the service to generate illegal content, to harass or
            harm others, to produce sexual content involving minors, or to abuse,
            overload, or attempt to circumvent the rate limits and security of
            the service.
          </p>

          <h2 style={{ marginTop: 28 }}>No warranty</h2>
          <p className="lead">
            The service is provided &ldquo;as is,&rdquo; without warranties of
            any kind. AI output can be inaccurate or unexpected; we don&apos;t
            guarantee it is fit for any particular purpose.
          </p>

          <h2 style={{ marginTop: 28 }}>Limitation of liability</h2>
          <p className="lead">
            To the extent permitted by law, we are not liable for any indirect or
            consequential damages arising from your use of the service.
          </p>

          <h2 style={{ marginTop: 28 }}>Changes</h2>
          <p className="lead">
            We may update these terms; the date above reflects the latest
            version. Continued use means you accept the changes. See our{" "}
            <Link href="/privacy">privacy policy</Link> for how we handle data.
          </p>
        </div>

        <p className="lead" style={{ fontSize: 14, marginTop: 28 }}>
          <Link href="/">← Home</Link> · <Link href="/privacy">Privacy</Link>
        </p>
      </section>
    </main>
  );
}
