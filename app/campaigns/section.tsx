// A collapsible section of the campaign workspace: a heading with an item count
// that toggles its body open/closed. Server-safe (no client hooks — uses native
// <details>), so it can wrap both server- and client-rendered children.
import type { ReactNode } from "react";

export function Section({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="csection" open={defaultOpen}>
      <summary className="csection-head">
        <span className="csection-title">{title}</span>
        {count != null && <span className="csection-count">{count}</span>}
      </summary>
      <div className="csection-body">{children}</div>
    </details>
  );
}
