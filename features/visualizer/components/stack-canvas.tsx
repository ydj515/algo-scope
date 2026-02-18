"use client";

import type { ListSnapshot } from "@/features/visualizer/types";

type Props = {
  snapshot: ListSnapshot | null;
};

const BOX_WIDTH = 220;
const BOX_HEIGHT = 44;
const BOX_GAP = 10;
const START_X = 260;
const START_Y = 36;
const EMPTY_HEIGHT = 360;

export function StackCanvas({ snapshot }: Props) {
  if (!snapshot || snapshot.size === 0) {
    return (
      <div style={{ height: EMPTY_HEIGHT }} className="flex items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
        스택이 비어 있습니다.
      </div>
    );
  }

  const highlighted = new Set(snapshot.highlights?.nodeIds ?? []);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <svg viewBox="0 0 760 360" className="w-full" style={{ height: EMPTY_HEIGHT }}>
        {snapshot.order.map((id, index) => {
          const node = snapshot.nodes[id];
          const x = START_X;
          const y = START_Y + index * (BOX_HEIGHT + BOX_GAP);
          const isTop = snapshot.headId === id;
          const isBottom = snapshot.tailId === id;
          const isHighlighted = highlighted.has(id);

          return (
            <g key={`stack-node-${id}`}>
              <rect
                x={x}
                y={y}
                width={BOX_WIDTH}
                height={BOX_HEIGHT}
                rx={8}
                fill={isHighlighted ? "#fde68a" : "#e2e8f0"}
                stroke={isHighlighted ? "#f59e0b" : "#475569"}
                strokeWidth={isHighlighted ? 3 : 2}
              />
              <text x={x + BOX_WIDTH / 2} y={y + BOX_HEIGHT / 2 + 4} textAnchor="middle" className="fill-zinc-900 text-sm font-semibold">
                {node.value}
              </text>

              {isTop ? (
                <text x={x - 24} y={y + BOX_HEIGHT / 2 + 4} textAnchor="end" className="fill-blue-600 text-[11px] font-bold">
                  TOP
                </text>
              ) : null}

              {isBottom ? (
                <text x={x + BOX_WIDTH + 24} y={y + BOX_HEIGHT / 2 + 4} textAnchor="start" className="fill-emerald-600 text-[11px] font-bold">
                  BOTTOM
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
