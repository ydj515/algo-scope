"use client";

import type { ListSnapshot } from "@/features/visualizer/types";
import { CanvasFrame } from "@/features/ui/components/canvas-frame";

type Props = {
  snapshot: ListSnapshot | null;
};

type PositionedNode = {
  id: number;
  x: number;
  y: number;
  leftId: number | null;
  rightId: number | null;
};

const VIEW_WIDTH = 980;
const VIEW_HEIGHT = 420;
const TOP_Y = 44;
const LEVEL_GAP = 78;
const NODE_RADIUS = 22;

function resolveLeftId(node: ListSnapshot["nodes"][number]): number | null {
  return node.prevId === node.id ? null : node.prevId;
}

function resolveRightId(node: ListSnapshot["nodes"][number]): number | null {
  return node.nextId === node.id ? null : node.nextId;
}

function buildLayout(snapshot: ListSnapshot): PositionedNode[] {
  if (snapshot.headId === null) {
    return [];
  }

  const positioned: PositionedNode[] = [];
  const queue: Array<{ id: number; depth: number; index: number }> = [
    { id: snapshot.headId, depth: 0, index: 0 },
  ];
  const visited = new Set<number>();

  while (queue.length > 0 && positioned.length < snapshot.size) {
    const current = queue.shift();
    if (!current || visited.has(current.id)) {
      continue;
    }

    const node = snapshot.nodes[current.id];
    if (!node) {
      continue;
    }

    visited.add(current.id);

    const slots = 2 ** current.depth;
    const x = ((current.index + 0.5) * VIEW_WIDTH) / slots;
    const y = TOP_Y + current.depth * LEVEL_GAP;

    const leftId = resolveLeftId(node);
    const rightId = resolveRightId(node);

    positioned.push({ id: current.id, x, y, leftId, rightId });

    if (leftId !== null) {
      queue.push({ id: leftId, depth: current.depth + 1, index: current.index * 2 });
    }
    if (rightId !== null) {
      queue.push({ id: rightId, depth: current.depth + 1, index: current.index * 2 + 1 });
    }
  }

  return positioned;
}

export function TreeCanvas({ snapshot }: Props) {
  if (!snapshot || snapshot.size === 0) {
    return (
      <CanvasFrame
        hasData={false}
        emptyText="트리가 비어 있습니다."
        className="h-[420px]"
      />
    );
  }

  const highlighted = new Set(snapshot.highlights?.nodeIds ?? []);
  const layout = buildLayout(snapshot);
  const byId = new Map(layout.map((item) => [item.id, item]));

  return (
    <CanvasFrame hasData className="p-3">
      <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="h-[420px] w-full">
        {layout.map((item) => {
          const left = item.leftId === null ? null : byId.get(item.leftId);
          const right = item.rightId === null ? null : byId.get(item.rightId);

          return (
            <g key={`edge-${item.id}`}>
              {left ? <line x1={item.x} y1={item.y + NODE_RADIUS} x2={left.x} y2={left.y - NODE_RADIUS} stroke="var(--viz-link-default)" strokeWidth={2} /> : null}
              {right ? <line x1={item.x} y1={item.y + NODE_RADIUS} x2={right.x} y2={right.y - NODE_RADIUS} stroke="var(--viz-link-default)" strokeWidth={2} /> : null}
            </g>
          );
        })}

        {layout.map((item) => {
          const node = snapshot.nodes[item.id];
          const isRoot = snapshot.headId === item.id;
          const isHighlighted = highlighted.has(item.id);

          return (
            <g key={`tree-node-${item.id}`}>
              <circle
                cx={item.x}
                cy={item.y}
                r={NODE_RADIUS}
                fill={isHighlighted ? "var(--viz-node-highlight)" : "var(--viz-node-default)"}
                stroke={isHighlighted ? "var(--viz-node-highlight-stroke)" : "var(--viz-node-stroke)"}
                strokeWidth={isHighlighted ? 3 : 2}
              />
              <text x={item.x} y={item.y + 4} textAnchor="middle" className="fill-[var(--viz-cell-text)] text-xs font-semibold">
                {node.value}
              </text>
              {isRoot ? (
                <text x={item.x} y={item.y - 30} textAnchor="middle" className="fill-[var(--viz-label-head)] text-[11px] font-bold">
                  ROOT
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </CanvasFrame>
  );
}
