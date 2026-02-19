"use client";

import type { ListSnapshot } from "@/features/visualizer/types";
import { CanvasFrame } from "@/features/ui/components/canvas-frame";

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
      <CanvasFrame
        hasData={false}
        emptyText="스택이 비어 있습니다."
        className="h-[360px]"
      />
    );
  }

  const highlighted = new Set(snapshot.highlights?.nodeIds ?? []);

  return (
    <CanvasFrame hasData className="p-3">
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
                fill={isHighlighted ? "var(--viz-node-highlight)" : "var(--viz-node-default)"}
                stroke={isHighlighted ? "var(--viz-node-highlight-stroke)" : "var(--viz-node-stroke)"}
                strokeWidth={isHighlighted ? 3 : 2}
              />
              <text x={x + BOX_WIDTH / 2} y={y + BOX_HEIGHT / 2 + 4} textAnchor="middle" className="fill-[var(--viz-cell-text)] text-sm font-semibold">
                {node.value}
              </text>

              {isTop ? (
                <text x={x - 24} y={y + BOX_HEIGHT / 2 + 4} textAnchor="end" className="fill-[var(--viz-label-head)] text-[11px] font-bold">
                  TOP
                </text>
              ) : null}

              {isBottom ? (
                <text x={x + BOX_WIDTH + 24} y={y + BOX_HEIGHT / 2 + 4} textAnchor="start" className="fill-[var(--viz-label-tail)] text-[11px] font-bold">
                  BOTTOM
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </CanvasFrame>
  );
}
