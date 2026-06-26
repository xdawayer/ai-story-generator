// In-memory per-key rate limiter (pre-model abuse gate).
// NOTE: per-instance only — on serverless/multi-instance this resets per cold
// start and is not shared across instances. For production, replace with a
// shared store (Upstash Redis / Vercel KV). This is the MVP gate the review
// flagged as non-negotiable: bound spend BEFORE the model call.
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter: number; // seconds
}

export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, retryAfter: 0 };
  }

  if (b.count >= opts.limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }

  b.count += 1;
  return { ok: true, remaining: opts.limit - b.count, retryAfter: 0 };
}
