"use client";

import type { ListSnapshot } from "@/features/visualizer/types";

type Props = {
  snapshot: ListSnapshot | null;
};

const BOX_WIDTH = 120;
const BOX_HEIGHT = 56;
const BOX_GAP = 20;
const START_X = 48;
const START_Y = 152;
const EMPTY_HEIGHT = 360;

export function QueueCanvas({ snapshot }: Props) {
  if (!snapshot || snapshot.size === 0) {
    return (
      <div style={{ height: EMPTY_HEIGHT }} className="flex items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
        큐가 비어 있습니다.
      </div>
    );
  }

  const highlighted = new Set(snapshot.highlights?.nodeIds ?? []);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <svg viewBox="0 0 920 360" className="w-full" style={{ height: EMPTY_HEIGHT }}>
        {snapshot.order.map((id, index) => {
          const node = snapshot.nodes[id];
          const x = START_X + index * (BOX_WIDTH + BOX_GAP);
          const y = START_Y;
          const isFront = snapshot.headId === id;
          const isRear = snapshot.tailId === id;
          const isHighlighted = highlighted.has(id);

          return (
            <g key={`queue-node-${id}`}>
              <rect
                x={x}
                y={y}
                width={BOX_WIDTH}
                height={BOX_HEIGHT}
                rx={10}
                fill={isHighlighted ? "#fde68a" : "#e2e8f0"}
                stroke={isHighlighted ? "#f59e0b" : "#475569"}
                strokeWidth={isHighlighted ? 3 : 2}
              />
              <text x={x + BOX_WIDTH / 2} y={y + BOX_HEIGHT / 2 + 4} textAnchor="middle" className="fill-zinc-900 text-sm font-semibold">
                {node.value}
              </text>

              {index < snapshot.order.length - 1 ? (
                <text x={x + BOX_WIDTH + BOX_GAP / 2} y={y + BOX_HEIGHT / 2 + 5} textAnchor="middle" className="fill-zinc-500 text-sm font-semibold">
                  →
                </text>
              ) : null}

              {isFront ? (
                <text x={x + BOX_WIDTH / 2} y={y - 16} textAnchor="middle" className="fill-blue-600 text-[11px] font-bold">
                  FRONT
                </text>
              ) : null}

              {isRear ? (
                <text x={x + BOX_WIDTH / 2} y={y + BOX_HEIGHT + 18} textAnchor="middle" className="fill-emerald-600 text-[11px] font-bold">
                  REAR
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
