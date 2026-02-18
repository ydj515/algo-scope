"use client";

import type { ListSnapshot } from "@/features/visualizer/types";

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
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
        트리가 비어 있습니다.
      </div>
    );
  }

  const highlighted = new Set(snapshot.highlights?.nodeIds ?? []);
  const layout = buildLayout(snapshot);
  const byId = new Map(layout.map((item) => [item.id, item]));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="h-[420px] w-full">
        {layout.map((item) => {
          const left = item.leftId === null ? null : byId.get(item.leftId);
          const right = item.rightId === null ? null : byId.get(item.rightId);

          return (
            <g key={`edge-${item.id}`}>
              {left ? <line x1={item.x} y1={item.y + NODE_RADIUS} x2={left.x} y2={left.y - NODE_RADIUS} stroke="#64748b" strokeWidth={2} /> : null}
              {right ? <line x1={item.x} y1={item.y + NODE_RADIUS} x2={right.x} y2={right.y - NODE_RADIUS} stroke="#64748b" strokeWidth={2} /> : null}
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
                fill={isHighlighted ? "#fde68a" : "#e2e8f0"}
                stroke={isHighlighted ? "#f59e0b" : "#475569"}
                strokeWidth={isHighlighted ? 3 : 2}
              />
              <text x={item.x} y={item.y + 4} textAnchor="middle" className="fill-zinc-900 text-xs font-semibold">
                {node.value}
              </text>
              {isRoot ? (
                <text x={item.x} y={item.y - 30} textAnchor="middle" className="fill-blue-600 text-[11px] font-bold">
                  ROOT
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
