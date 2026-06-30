// Root loading UI shown while a route segment streams in. Simple, on-brand
// placeholder using the shared .wrap container.
export default function Loading() {
  return (
    <main className="hero wrap" aria-busy="true">
      <p className="lead" style={{ fontWeight: 600 }}>
        Loading…
      </p>
      <p className="lead">Summoning your content.</p>
    </main>
  );
}
