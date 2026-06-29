// Per-key rate limiter (pre-model abuse gate): bound spend BEFORE the model call.
// Backed by Postgres (Supabase) via an atomic fixed-window counter so it works
// across serverless instances. Falls back to an in-memory map when Supabase is
// not configured, and fails OPEN (allows the request) on any DB error so a
// limiter outage never takes the product down.
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter: number; // seconds
}

// ---- in-memory fallback (single instance) ----
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function rateLimitMemory(
  key: string,
  opts: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, retryAfter: 0 };
  }
  if (b.count >= opts.limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((b.resetAt - now) / 1000),
    };
  }
  b.count += 1;
  return { ok: true, remaining: opts.limit - b.count, retryAfter: 0 };
}

// ---- shared Postgres-backed limiter ----
export async function rateLimit(
  key: string,
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
  if (!isSupabaseConfigured()) return rateLimitMemory(key, opts);

  try {
    const now = Date.now();
    const windowStart = Math.floor(now / opts.windowMs) * opts.windowMs;
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc("increment_rate_limit", {
      p_key: key,
      p_window_start: windowStart,
      p_window_ms: opts.windowMs,
    });
    if (error || typeof data !== "number") {
      return { ok: true, remaining: opts.limit, retryAfter: 0 }; // fail open
    }
    const count = data;
    const within = count <= opts.limit;
    return {
      ok: within,
      remaining: Math.max(0, opts.limit - count),
      retryAfter: within ? 0 : Math.ceil((windowStart + opts.windowMs - now) / 1000),
    };
  } catch {
    return { ok: true, remaining: opts.limit, retryAfter: 0 }; // fail open
  }
}
