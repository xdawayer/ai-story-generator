"use client";

// The campaign world map: an SVG force-directed graph of the links between
// entities. Nodes are colored by kind, sized by degree; a click jumps to (and
// opens) that entity's card, hover highlights its immediate connections. Only
// connected entities appear — isolated ones would just be noise here.
//
// The layout uses a deterministic Fruchterman-Reingold pass, but it runs
// CLIENT-SIDE ONLY (in an effect): Math.cos/sin aren't guaranteed bit-identical
// across V8 builds, so computing coordinates during SSR could desync hydration.
// The server (and first client paint) render a placeholder instead.
import { useEffect, useMemo, useState } from "react";
import {
  LINK_LABELS,
  linkKey,
  type LinkEdge,
  type LinkKind,
  type LinkTarget,
} from "@/lib/link-kinds";
import { jumpToEntry } from "./connections";

const NODE_COLORS: Record<LinkKind, string> = {
  npc: "#d8a23c",
  location: "#5aa9a0",
  faction: "#c4483c",
  plot_thread: "#9b7bd0",
  story: "#5b8fd0",
};

// Internal layout space; the SVG scales to its container via viewBox.
const W = 640;
const H = 420;

interface Pt {
  x: number;
  y: number;
}

// Deterministic force-directed layout (no randomness): seed on a circle, then
// relax with node repulsion + edge springs + gentle centering, cooling each
// step. Finally rescale the bounding box to fit the viewBox with padding.
function computeLayout(n: number, edges: { a: number; b: number }[]): Pt[] {
  if (n === 0) return [];
  const k = Math.sqrt((W * H) / n);
  const pos: Pt[] = Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n;
    return {
      x: W / 2 + Math.cos(a) * W * 0.28,
      y: H / 2 + Math.sin(a) * H * 0.28,
    };
  });
  const iters = n > 60 ? 200 : 320;
  let temp = W * 0.12;
  for (let it = 0; it < iters; it++) {
    const disp: Pt[] = Array.from({ length: n }, () => ({ x: 0, y: 0 }));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const rep = (k * k) / dist;
        const ux = dx / dist;
        const uy = dy / dist;
        disp[i].x += ux * rep;
        disp[i].y += uy * rep;
        disp[j].x -= ux * rep;
        disp[j].y -= uy * rep;
      }
    }
    for (const e of edges) {
      const dx = pos[e.a].x - pos[e.b].x;
      const dy = pos[e.a].y - pos[e.b].y;
      const dist = Math.hypot(dx, dy) || 0.01;
      const att = (dist * dist) / k;
      const ux = dx / dist;
      const uy = dy / dist;
      disp[e.a].x -= ux * att;
      disp[e.a].y -= uy * att;
      disp[e.b].x += ux * att;
      disp[e.b].y += uy * att;
    }
    for (let i = 0; i < n; i++) {
      const d = Math.hypot(disp[i].x, disp[i].y) || 0.01;
      const lim = Math.min(d, temp);
      pos[i].x += (disp[i].x / d) * lim;
      pos[i].y += (disp[i].y / d) * lim;
      pos[i].x += (W / 2 - pos[i].x) * 0.008;
      pos[i].y += (H / 2 - pos[i].y) * 0.008;
    }
    temp = Math.max(temp * 0.965, 1);
  }
  const pad = 44;
  const xs = pos.map((p) => p.x);
  const ys = pos.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  return pos.map((p) => ({
    x: pad + ((p.x - minX) / spanX) * (W - 2 * pad),
    y: pad + ((p.y - minY) / spanY) * (H - 2 * pad),
  }));
}

export function GraphView({
  nodes,
  edges,
}: {
  nodes: LinkTarget[];
  edges: LinkEdge[];
}) {
  const [hover, setHover] = useState<string | null>(null);

  // Reduce to connected nodes + integer-indexed edges (deterministic; safe to
  // memo on the server). Positions are computed separately, client-side.
  const model = useMemo(() => {
    const inEdge = new Set<string>();
    for (const e of edges) {
      inEdge.add(linkKey(e.aKind, e.aId));
      inEdge.add(linkKey(e.bKind, e.bId));
    }
    const connected = nodes.filter((nd) => inEdge.has(linkKey(nd.kind, nd.id)));
    const index = new Map(
      connected.map((nd, i) => [linkKey(nd.kind, nd.id), i]),
    );
    const eIdx = edges
      .map((e) => {
        const a = index.get(linkKey(e.aKind, e.aId));
        const b = index.get(linkKey(e.bKind, e.bId));
        return a != null && b != null ? { a, b, id: e.id } : null;
      })
      .filter((e): e is { a: number; b: number; id: string } => e != null);
    const degree = connected.map(() => 0);
    for (const e of eIdx) {
      degree[e.a] += 1;
      degree[e.b] += 1;
    }
    return { connected, eIdx, degree };
  }, [nodes, edges]);

  const [pos, setPos] = useState<Pt[] | null>(null);
  useEffect(() => {
    setPos(computeLayout(model.connected.length, model.eIdx));
  }, [model]);

  const { connected, eIdx, degree } = model;

  if (connected.length === 0) {
    return (
      <p className="empty">
        No connections yet — link entities (or use the Suggested chips) to see
        your world map.
      </p>
    );
  }

  const kindsPresent = Array.from(new Set(connected.map((n) => n.kind)));

  // Neighbors of the hovered node (for the highlight/dim treatment).
  const hoverIdx =
    hover == null
      ? -1
      : connected.findIndex((n) => linkKey(n.kind, n.id) === hover);
  const neighbors = new Set<number>();
  if (hoverIdx >= 0) {
    for (const e of eIdx) {
      if (e.a === hoverIdx) neighbors.add(e.b);
      if (e.b === hoverIdx) neighbors.add(e.a);
    }
  }

  return (
    <div className="graph-wrap">
      {pos == null ? (
        <div className="graph-svg graph-loading">Building the map…</div>
      ) : (
        <svg
          className="graph-svg"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Campaign world map"
        >
          {eIdx.map((e) => {
            const active =
              hoverIdx >= 0 && (e.a === hoverIdx || e.b === hoverIdx);
            const dim = hoverIdx >= 0 && !active;
            return (
              <line
                key={e.id}
                x1={pos[e.a].x}
                y1={pos[e.a].y}
                x2={pos[e.b].x}
                y2={pos[e.b].y}
                stroke={active ? "var(--accent)" : "var(--line)"}
                strokeOpacity={dim ? 0.12 : active ? 0.9 : 0.5}
                strokeWidth={active ? 2 : 1}
              />
            );
          })}
          {connected.map((nd, i) => {
            const r = 6 + Math.min(degree[i], 6);
            const dim = hoverIdx >= 0 && i !== hoverIdx && !neighbors.has(i);
            const leftSide = pos[i].x > W * 0.66;
            const label =
              nd.label.length > 20 ? `${nd.label.slice(0, 19)}…` : nd.label;
            return (
              <g
                key={linkKey(nd.kind, nd.id)}
                className="graph-node"
                opacity={dim ? 0.22 : 1}
                onMouseEnter={() => setHover(linkKey(nd.kind, nd.id))}
                onMouseLeave={() => setHover(null)}
                onClick={() => jumpToEntry(nd.kind, nd.id)}
              >
                <circle
                  cx={pos[i].x}
                  cy={pos[i].y}
                  r={r}
                  fill={NODE_COLORS[nd.kind]}
                  stroke="rgba(20,16,12,0.9)"
                  strokeWidth={1.5}
                >
                  <title>{`${LINK_LABELS[nd.kind]}: ${nd.label}`}</title>
                </circle>
                <text
                  className="graph-node-label"
                  x={leftSide ? pos[i].x - r - 4 : pos[i].x + r + 4}
                  y={pos[i].y + 3.5}
                  textAnchor={leftSide ? "end" : "start"}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
      <div className="graph-legend">
        {kindsPresent.map((kd) => (
          <span key={kd} className="graph-legend-item">
            <span
              className="graph-legend-dot"
              style={{ background: NODE_COLORS[kd] }}
            />
            {LINK_LABELS[kd]}
          </span>
        ))}
      </div>
    </div>
  );
}
