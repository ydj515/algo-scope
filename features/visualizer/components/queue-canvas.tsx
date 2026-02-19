"use client";

import type { ListSnapshot } from "@/features/visualizer/types";
import { CanvasFrame } from "@/features/ui/components/canvas-frame";

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
      <CanvasFrame
        hasData={false}
        emptyText="큐가 비어 있습니다."
        className="h-[360px]"
      />
    );
  }

  const highlighted = new Set(snapshot.highlights?.nodeIds ?? []);

  return (
    <CanvasFrame hasData className="p-3">
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
                fill={isHighlighted ? "var(--viz-node-highlight)" : "var(--viz-node-default)"}
                stroke={isHighlighted ? "var(--viz-node-highlight-stroke)" : "var(--viz-node-stroke)"}
                strokeWidth={isHighlighted ? 3 : 2}
              />
              <text x={x + BOX_WIDTH / 2} y={y + BOX_HEIGHT / 2 + 4} textAnchor="middle" className="fill-[var(--viz-cell-text)] text-sm font-semibold">
                {node.value}
              </text>

              {index < snapshot.order.length - 1 ? (
                <text x={x + BOX_WIDTH + BOX_GAP / 2} y={y + BOX_HEIGHT / 2 + 5} textAnchor="middle" className="fill-[var(--viz-label-dim)] text-sm font-semibold">
                  →
                </text>
              ) : null}

              {isFront ? (
                <text x={x + BOX_WIDTH / 2} y={y - 16} textAnchor="middle" className="fill-[var(--viz-label-head)] text-[11px] font-bold">
                  FRONT
                </text>
              ) : null}

              {isRear ? (
                <text x={x + BOX_WIDTH / 2} y={y + BOX_HEIGHT + 18} textAnchor="middle" className="fill-[var(--viz-label-tail)] text-[11px] font-bold">
                  REAR
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </CanvasFrame>
  );
}
