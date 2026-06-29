"use client";

// Tiny client island so the homepage can stay a static server component while
// still firing analytics on its key navigations. Renders a real <Link> (crawlable
// <a> with a real href) and fires a typed event on click — navigation is never
// blocked, the event is best-effort (trackEvent already swallows failures).
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { trackEvent, type AnalyticsEvent, type AnalyticsProps } from "@/lib/track";

export function TrackedLink({
  href,
  event,
  eventProps,
  className,
  style,
  children,
}: {
  href: string;
  event: AnalyticsEvent;
  eventProps?: AnalyticsProps;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={() => trackEvent(event, eventProps)}
    >
      {children}
    </Link>
  );
}
