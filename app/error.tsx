"use client";

// Root error boundary. Client component (required) with a reset() to retry the
// failed segment. Kept on-brand with the parchment theme via existing classes.
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="hero wrap">
      <h1>Something went wrong</h1>
      <p className="lead">
        A spell misfired and this page couldn&apos;t load. You can try again, or
        head back to safer ground.
      </p>
      <div className="actions" style={{ marginTop: 20 }}>
        <button
          className="primary"
          onClick={reset}
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            color: "#111324",
            fontWeight: 750,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          className="ghost"
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 18px",
            borderRadius: 12,
          }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
