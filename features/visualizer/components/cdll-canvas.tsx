"use client";

import type { ListSnapshot } from "@/features/visualizer/types";
import { CanvasFrame } from "@/features/ui/components/canvas-frame";

type Props = {
  snapshot: ListSnapshot | null;
};

const WIDTH = 760;
const HEIGHT = 360;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const EMPTY_CANVAS_HEIGHT = 360;
const BASE_LAYOUT_RADIUS = 70;
const MAX_LAYOUT_RADIUS = 130;
const LAYOUT_RADIUS_STEP = 8;

const NODE_RADIUS = 24;
const NODE_LABEL_OFFSET_Y = 4;
const HEAD_BADGE_OFFSET_Y = -32;
const TAIL_BADGE_OFFSET_Y = 40;

const EDGE_NEXT_COLOR = "var(--viz-link-next)";
const EDGE_PREV_COLOR = "var(--viz-link-prev)";
const NODE_FILL_DEFAULT = "var(--viz-node-default)";
const NODE_FILL_HIGHLIGHT = "var(--viz-node-highlight)";
const NODE_STROKE_DEFAULT = "var(--viz-node-stroke)";
const NODE_STROKE_HIGHLIGHT = "var(--viz-node-highlight-stroke)";
const NODE_STROKE_WIDTH_DEFAULT = 2;
const NODE_STROKE_WIDTH_HIGHLIGHT = 3;
const EDGE_NEXT_WIDTH = 1.5;
const EDGE_PREV_WIDTH = 1.25;
const EDGE_NEXT_OPACITY = 0.85;
const EDGE_PREV_OPACITY = 0.7;

function polarToCartesian(radius: number, angle: number) {
  return {
    x: CENTER_X + radius * Math.cos(angle),
    y: CENTER_Y + radius * Math.sin(angle),
  };
}

export function CdllCanvas({ snapshot }: Props) {
  if (!snapshot || snapshot.size === 0) {
    return (
      <CanvasFrame
        hasData={false}
        emptyText="리스트가 비어 있습니다."
        className="h-[360px]"
      />
    );
  }

  const radius = Math.min(MAX_LAYOUT_RADIUS, BASE_LAYOUT_RADIUS + snapshot.size * LAYOUT_RADIUS_STEP);
  const positions = new Map<number, { x: number; y: number }>();

  snapshot.order.forEach((id, index) => {
    const angle = (2 * Math.PI * index) / snapshot.order.length - Math.PI / 2;
    positions.set(id, polarToCartesian(radius, angle));
  });

  const highlightedNodes = new Set(snapshot.highlights?.nodeIds ?? []);

  return (
    <CanvasFrame hasData className="p-3">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ height: EMPTY_CANVAS_HEIGHT }}>
        <defs>
          <marker id="arrow-next" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={EDGE_NEXT_COLOR} />
          </marker>
          <marker id="arrow-prev" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={EDGE_PREV_COLOR} />
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
              <line
                x1={from.x}
                y1={from.y}
                x2={toNext.x}
                y2={toNext.y}
                stroke={EDGE_NEXT_COLOR}
                strokeWidth={EDGE_NEXT_WIDTH}
                markerEnd="url(#arrow-next)"
                opacity={EDGE_NEXT_OPACITY}
              />
              <line
                x1={from.x}
                y1={from.y}
                x2={toPrev.x}
                y2={toPrev.y}
                stroke={EDGE_PREV_COLOR}
                strokeWidth={EDGE_PREV_WIDTH}
                markerEnd="url(#arrow-prev)"
                opacity={EDGE_PREV_OPACITY}
              />
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
              <circle
                cx={pos.x}
                cy={pos.y}
                r={NODE_RADIUS}
                fill={isHighlighted ? NODE_FILL_HIGHLIGHT : NODE_FILL_DEFAULT}
                stroke={isHighlighted ? NODE_STROKE_HIGHLIGHT : NODE_STROKE_DEFAULT}
                strokeWidth={isHighlighted ? NODE_STROKE_WIDTH_HIGHLIGHT : NODE_STROKE_WIDTH_DEFAULT}
              />
              <text x={pos.x} y={pos.y + NODE_LABEL_OFFSET_Y} textAnchor="middle" className="fill-[var(--viz-cell-text)] text-xs font-semibold">
                {node.value}
              </text>

              {isHead ? (
                <text x={pos.x} y={pos.y + HEAD_BADGE_OFFSET_Y} textAnchor="middle" className="fill-[var(--viz-label-head)] text-[11px] font-bold">
                  HEAD
                </text>
              ) : null}

              {isTail ? (
                <text x={pos.x} y={pos.y + TAIL_BADGE_OFFSET_Y} textAnchor="middle" className="fill-[var(--viz-label-tail)] text-[11px] font-bold">
                  TAIL
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </CanvasFrame>
  );
}
