"use client";

import type { ListSnapshot } from "@/features/visualizer/types";

type Props = {
  snapshot: ListSnapshot | null;
};

const WIDTH = 760;
const HEIGHT = 360;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

function polarToCartesian(radius: number, angle: number) {
  return {
    x: CENTER_X + radius * Math.cos(angle),
    y: CENTER_Y + radius * Math.sin(angle),
  };
}

export function CdllCanvas({ snapshot }: Props) {
  if (!snapshot || snapshot.size === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
        리스트가 비어 있습니다.
      </div>
    );
  }

  const radius = Math.min(130, 70 + snapshot.size * 8);
  const positions = new Map<number, { x: number; y: number }>();

  snapshot.order.forEach((id, index) => {
    const angle = (2 * Math.PI * index) / snapshot.order.length - Math.PI / 2;
    positions.set(id, polarToCartesian(radius, angle));
  });

  const highlightedNodes = new Set(snapshot.highlights?.nodeIds ?? []);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-[360px] w-full">
        <defs>
          <marker id="arrow-next" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
          </marker>
          <marker id="arrow-prev" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
          </marker>
        </defs>

        {snapshot.order.map((id) => {
          const node = snapshot.nodes[id];
          const from = positions.get(id);
          const toNext = positions.get(node.nextId);
          const toPrev = positions.get(node.prevId);

          if (!from || !toNext || !toPrev) {
            return null;
          }

          return (
            <g key={`edges-${id}`}>
              <line x1={from.x} y1={from.y} x2={toNext.x} y2={toNext.y} stroke="#334155" strokeWidth={1.5} markerEnd="url(#arrow-next)" opacity={0.85} />
              <line x1={from.x} y1={from.y} x2={toPrev.x} y2={toPrev.y} stroke="#16a34a" strokeWidth={1.25} markerEnd="url(#arrow-prev)" opacity={0.7} />
            </g>
          );
        })}

        {snapshot.order.map((id) => {
          const node = snapshot.nodes[id];
          const pos = positions.get(id);
          if (!pos) {
            return null;
          }

          const isHead = snapshot.headId === id;
          const isTail = snapshot.tailId === id;
          const isHighlighted = highlightedNodes.has(id);

          return (
            <g key={`node-${id}`}>
              <circle cx={pos.x} cy={pos.y} r={24} fill={isHighlighted ? "#fde68a" : "#e2e8f0"} stroke={isHighlighted ? "#f59e0b" : "#475569"} strokeWidth={isHighlighted ? 3 : 2} />
              <text x={pos.x} y={pos.y + 4} textAnchor="middle" className="fill-zinc-900 text-xs font-semibold">
                {node.value}
              </text>

              {isHead ? (
                <text x={pos.x} y={pos.y - 32} textAnchor="middle" className="fill-blue-600 text-[11px] font-bold">
                  HEAD
                </text>
              ) : null}

              {isTail ? (
                <text x={pos.x} y={pos.y + 40} textAnchor="middle" className="fill-emerald-600 text-[11px] font-bold">
                  TAIL
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
