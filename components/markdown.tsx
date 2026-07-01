"use client";

// Minimal, dependency-free Markdown renderer for saved campaign content
// (NPCs, stories, recaps). Returns React elements only — never innerHTML /
// dangerouslySetInnerHTML — so it keeps the same XSS-safe discipline as the
// plain-text OutputPanel while still showing headings, bold, and lists.
//
// Supports: ATX headings (#..######), thematic breaks (--- / *** / ___),
// unordered lists (- or *), paragraphs, inline **bold** and `code`.
// A `spoilerLabels` list turns matching "**Label:** value" bullets into a
// click-to-reveal spoiler — handy for hiding an NPC's Secret from players.
import { type ReactNode, useState } from "react";

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "hr" }
  | { kind: "list"; items: string[] }
  | { kind: "para"; text: string };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] | null = null;

  const flushPara = () => {
    if (para.length) {
      blocks.push({ kind: "para", text: para.join("\n") });
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ kind: "list", items: list });
      list = null;
    }
  };

  for (const raw of lines) {
    const t = raw.trim();
    if (t === "") {
      flushPara();
      flushList();
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) {
      flushPara();
      flushList();
      blocks.push({ kind: "hr" });
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(t);
    if (heading) {
      flushPara();
      flushList();
      blocks.push({
        kind: "heading",
        level: heading[1].length,
        text: heading[2],
      });
      continue;
    }
    const bullet = /^[-*]\s+(.*)$/.exec(t);
    if (bullet) {
      flushPara();
      if (!list) list = [];
      list.push(bullet[1]);
      continue;
    }
    flushList();
    para.push(t);
  }
  flushPara();
  flushList();
  return blocks;
}

// Inline: **bold** and `code`. Everything else is literal text.
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|`([^`]+?)`/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] != null) nodes.push(<strong key={key++}>{m[1]}</strong>);
    else
      nodes.push(
        <code key={key++} className="md-code">
          {m[2]}
        </code>,
      );
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Spoiler({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState(false);
  if (shown) return <span className="spoiler-shown">{children}</span>;
  return (
    <button
      type="button"
      className="spoiler"
      onClick={() => setShown(true)}
      aria-label="Reveal hidden text"
    >
      ⦿ reveal
    </button>
  );
}

function ListItem({
  item,
  spoilerLabels,
}: {
  item: string;
  spoilerLabels?: string[];
}) {
  const labelled = /^\*\*(.+?):\*\*\s*(.*)$/.exec(item);
  if (
    labelled &&
    spoilerLabels?.some(
      (l) => l.toLowerCase() === labelled[1].trim().toLowerCase(),
    )
  ) {
    return (
      <li>
        <strong>{labelled[1]}:</strong>{" "}
        <Spoiler>{renderInline(labelled[2])}</Spoiler>
      </li>
    );
  }
  return <li>{renderInline(item)}</li>;
}

function HeadingBlock({ level, text }: { level: number; text: string }) {
  const cls = level <= 2 ? "md-h2" : level === 3 ? "md-h3" : "md-h4";
  const children = renderInline(text);
  if (level <= 2) return <h3 className={cls}>{children}</h3>;
  if (level === 3) return <h4 className={cls}>{children}</h4>;
  return <h5 className={cls}>{children}</h5>;
}

function Paragraph({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <p className="md-p">
      {parts.map((line, i) => (
        <span key={i}>
          {renderInline(line)}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}

export function Markdown({
  text,
  spoilerLabels,
}: {
  text: string;
  spoilerLabels?: string[];
}) {
  const blocks = parseBlocks(text);
  return (
    <div className="md">
      {blocks.map((b, i) => {
        if (b.kind === "hr") return <hr key={i} className="md-hr" />;
        if (b.kind === "heading")
          return <HeadingBlock key={i} level={b.level} text={b.text} />;
        if (b.kind === "list")
          return (
            <ul key={i} className="md-ul">
              {b.items.map((it, j) => (
                <ListItem key={j} item={it} spoilerLabels={spoilerLabels} />
              ))}
            </ul>
          );
        return <Paragraph key={i} text={b.text} />;
      })}
    </div>
  );
}
