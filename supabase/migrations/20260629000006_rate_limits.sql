-- Cross-instance rate limiting backed by Postgres (reuses Supabase — no new
-- service). The previous in-memory Map failed across serverless instances. A
-- fixed-window counter keyed by (key, window_start) is incremented atomically by
-- a SECURITY DEFINER function so the anon role can call it without table writes.

create table if not exists storygen.rate_limits (
  key           text   not null,
  window_start  bigint not null,        -- epoch ms of the window bucket
  count         int    not null default 0,
  primary key (key, window_start)
);

-- Atomically bump the counter for (key, window_start) and return the new value.
-- Also opportunistically prunes buckets older than the current window.
create or replace function storygen.increment_rate_limit(
  p_key text,
  p_window_start bigint,
  p_window_ms bigint
)
returns int
language plpgsql
security definer
set search_path = storygen
as $$
declare
  v_count int;
begin
  insert into storygen.rate_limits (key, window_start, count)
  values (p_key, p_window_start, 1)
  on conflict (key, window_start)
  do update set count = storygen.rate_limits.count + 1
  returning count into v_count;

  delete from storygen.rate_limits
  where window_start < p_window_start - p_window_ms;

  return v_count;
end;
$$;

grant execute on function storygen.increment_rate_limit(text, bigint, bigint)
  to anon, authenticated;
