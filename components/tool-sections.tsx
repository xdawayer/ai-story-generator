// Standard long-form sections for an RPG tool page: "What is the X?",
// "X examples", and "Who is the X for?". Server component; content comes from
// lib/rpg-tool-content.ts (never model output). Renders nothing if a tool has no
// content entry, so pages can include it unconditionally. "Related tools" is a
// separate block (components/related-tools.tsx) so each page can place it after
// its FAQ per the section template.
import { getToolContent } from "@/lib/rpg-tool-content";

export function ToolSections({ slug, name }: { slug: string; name: string }) {
  const content = getToolContent(slug);
  if (!content) return null;

  return (
    <>
      <h2 style={{ marginTop: 28 }}>What is the {name}?</h2>
      {content.whatIs.map((paragraph, i) => (
        <p key={i} className="lead">
          {paragraph}
        </p>
      ))}

      <h2 style={{ marginTop: 28 }}>{name} examples</h2>
      <div className="tools-grid" style={{ marginTop: 12 }}>
        {content.examples.map((example) => (
          <div key={example.title} className="card" style={{ cursor: "default" }}>
            <h3 style={{ margin: "0 0 6px" }}>{example.title}</h3>
            <p>{example.body}</p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 28 }}>Who is the {name} for?</h2>
      <ul style={{ color: "var(--muted)", lineHeight: 1.8 }}>
        {content.whoFor.map((item) => (
          <li key={item.who}>
            <strong>{item.who}</strong> — {item.why}
          </li>
        ))}
      </ul>
    </>
  );
}
