import type { Metadata } from "next";
import Link from "next/link";
import { PLANS } from "@/lib/plans";
import { WaitlistForm } from "./waitlist-form";

export const metadata: Metadata = {
  title: "Pricing — AI Story Generator",
  description:
    "Free forever for the core tools. Pro (coming soon) adds long-form stories, higher limits, and unlimited campaigns. Join the waitlist.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  const plans = [PLANS.free, PLANS.pro];
  return (
    <main className="hero wrap">
      <div className="eyebrow">
        <span className="dot" /> Simple pricing
      </div>
      <h1>Pricing</h1>
      <p className="lead">
        The core tools are free forever. Pro is coming soon — join the waitlist
        and we&apos;ll let you know first.
      </p>

      <div className="tools-grid" style={{ marginTop: 22 }}>
        {plans.map((plan) => (
          <div className="card" key={plan.tier} style={{ padding: 22 }}>
            <h3 style={{ fontSize: 20 }}>
              {plan.name}
              {plan.tier === "pro" && (
                <span className="badge">coming soon</span>
              )}
            </h3>
            <p style={{ marginTop: 4 }}>{plan.tagline}</p>
            <p
              style={{
                fontSize: 28,
                fontWeight: 800,
                margin: "12px 0",
                color: "var(--ink)",
              }}
            >
              {plan.price}
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                color: "var(--muted)",
                lineHeight: 1.9,
              }}
            >
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div style={{ marginTop: 16 }}>
              {plan.tier === "free" ? (
                <Link className="nav-cta" href="/">
                  Start free
                </Link>
              ) : (
                <WaitlistForm />
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="lead" style={{ fontSize: 14, marginTop: 24 }}>
        <Link href="/">← All Game Master tools</Link>
      </p>
    </main>
  );
}
