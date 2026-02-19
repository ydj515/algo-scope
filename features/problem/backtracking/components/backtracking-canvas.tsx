"use client";

import type { BacktrackingSnapshot } from "@/features/problem/backtracking/types";
import type { TraceStep } from "@/features/trace/types";
import { Badge } from "@/features/ui/components/badge";
import { CanvasFrame } from "@/features/ui/components/canvas-frame";

type Props = {
  snapshot: BacktrackingSnapshot | null;
  currentStep?: TraceStep<BacktrackingSnapshot> | null;
  currentIndex?: number;
  steps?: Array<TraceStep<BacktrackingSnapshot>>;
};

type TreeNode = {
  key: string;
  depth: number;
  value: number | null;
  parentKey: string | null;
  children: Set<string>;
};

const MAX_VISIBLE_NODES = 200;
const LAYOUT = {
  padX: 40,
  padY: 44,
  levelGap: 84,
  nodeRadius: 14,
  minWidth: 960,
  laneRowHeight: 28,
};

function pathKey(values: number[]): string {
  return values.length === 0 ? "root" : values.join(">");
}

function parentPathKey(values: number[]): string | null {
  if (values.length === 0) {
    return null;
  }
  return values.length === 1 ? "root" : values.slice(0, -1).join(">");
}

function pathKeys(values: number[]): string[] {
  const keys = ["root"];
  for (let i = 1; i <= values.length; i += 1) {
    keys.push(pathKey(values.slice(0, i)));
  }
  return keys;
}

function parsePathValues(key: string): number[] {
  if (key === "root") {
    return [];
  }
  return key.split(">").map((part) => Number(part));
}

function ensurePath(tree: Map<string, TreeNode>, values: number[]) {
  const key = pathKey(values);
  if (!tree.has(key)) {
    const parentKey = parentPathKey(values);
    tree.set(key, {
      key,
      depth: values.length,
      value: values.length === 0 ? null : values[values.length - 1],
      parentKey,
      children: new Set<string>(),
    });
  }

  if (values.length === 0) {
    return;
  }

  const parentValues = values.slice(0, -1);
  ensurePath(tree, parentValues);
  const parent = tree.get(pathKey(parentValues));
  if (parent) {
    parent.children.add(key);
  }
}

function treeFromTrace(
  snapshot: BacktrackingSnapshot,
  currentStep: TraceStep<BacktrackingSnapshot> | null | undefined,
  currentIndex: number | undefined,
  steps: Array<TraceStep<BacktrackingSnapshot>> | undefined,
) {
  const tree = new Map<string, TreeNode>();
  ensurePath(tree, []);

  const limit = currentIndex === undefined ? undefined : currentIndex + 1;
  const replaySteps = steps ? steps.slice(0, limit) : currentStep ? [currentStep] : [];

  for (const step of replaySteps) {
    const partial = step.snapshot.partial;
    ensurePath(tree, partial);
    if (step.snapshot.currentChoice !== null) {
      ensurePath(tree, [...partial, step.snapshot.currentChoice]);
    }
  }

  ensurePath(tree, snapshot.partial);
  if (snapshot.currentChoice !== null) {
    ensurePath(tree, [...snapshot.partial, snapshot.currentChoice]);
  }

  return tree;
}

function bfsOrder(tree: Map<string, TreeNode>): string[] {
  const queue = ["root"];
  const visited = new Set<string>(["root"]);
  const order: string[] = [];

  while (queue.length > 0) {
    const key = queue.shift();
    if (!key) {
      break;
    }
    if (key !== "root") {
      order.push(key);
    }

    const node = tree.get(key);
    if (!node) {
      continue;
    }
    const children = [...node.children].sort((a, b) => a.localeCompare(b, "en"));
    for (const child of children) {
      if (visited.has(child)) {
        continue;
      }
      visited.add(child);
      queue.push(child);
    }
  }

  return order;
}

function sampleKeys(
  tree: Map<string, TreeNode>,
  mode: "detailed" | "summary",
  currentPathSet: Set<string>,
  solutionPathSet: Set<string>,
): Set<string> {
  const selected = new Set<string>(["root"]);
  const maxNodes = MAX_VISIBLE_NODES;
  const addWithAncestors = (key: string) => {
    const chain: string[] = [];
    let cursor: string | null = key;
    while (cursor) {
      if (selected.has(cursor)) {
        break;
      }
      chain.push(cursor);
      const node = tree.get(cursor);
      cursor = node?.parentKey ?? null;
    }
    for (let i = chain.length - 1; i >= 0; i -= 1) {
      if (selected.size >= maxNodes) {
        return;
      }
      selected.add(chain[i]);
    }
  };

  const anchorOrder = [...currentPathSet, ...solutionPathSet];
  for (const key of anchorOrder) {
    if (selected.size >= maxNodes) {
      break;
    }
    addWithAncestors(key);
  }

  const order = bfsOrder(tree);
  if (selected.size >= maxNodes) {
    return selected;
  }

  if (mode === "detailed") {
    for (const key of order) {
      if (selected.size >= maxNodes) {
        break;
      }
      addWithAncestors(key);
    }
    return selected;
  }

  const remainingSlots = Math.max(maxNodes - selected.size, 1);
  const stride = Math.max(2, Math.ceil(order.length / remainingSlots));
  for (let i = 0; i < order.length && selected.size < maxNodes; i += stride) {
    addWithAncestors(order[i]);
  }
  for (const key of order) {
    if (selected.size >= maxNodes) {
      break;
    }
    addWithAncestors(key);
  }

  return selected;
}

function colorForNode(
  key: string,
  phase: TraceStep<BacktrackingSnapshot>["phase"] | undefined,
  activeKey: string | null,
  currentPathSet: Set<string>,
  solutionPathSet: Set<string>,
) {
  if (key === activeKey && phase === "prune") {
    return {
      fill: "var(--viz-bt-prune-fill)",
      stroke: "var(--viz-bt-prune-stroke)",
      text: "var(--viz-bt-prune-text)",
    };
  }
  if (key === activeKey && phase === "exit") {
    return {
      fill: "var(--viz-bt-solution-fill)",
      stroke: "var(--viz-bt-solution-stroke)",
      text: "var(--viz-bt-solution-text)",
    };
  }
  if (solutionPathSet.has(key)) {
    return {
      fill: "var(--viz-bt-solution-fill)",
      stroke: "var(--viz-bt-solution-stroke)",
      text: "var(--viz-bt-solution-text)",
    };
  }
  if (currentPathSet.has(key)) {
    return {
      fill: "var(--viz-bt-path-fill)",
      stroke: "var(--viz-bt-path-stroke)",
      text: "var(--viz-bt-path-text)",
    };
  }
  return {
    fill: "var(--viz-node-default)",
    stroke: "var(--viz-node-stroke)",
    text: "var(--viz-cell-text)",
  };
}

export function BacktrackingCanvas({
  snapshot,
  currentStep,
  currentIndex,
  steps,
}: Props) {
  if (!snapshot) {
    return (
      <CanvasFrame
        hasData={false}
        emptyText="입력을 설정하고 Execute를 눌러주세요."
        className="h-[320px]"
      />
    );
  }

  const tree = treeFromTrace(snapshot, currentStep, currentIndex, steps);
  const activePath = snapshot.currentChoice !== null
    ? [...snapshot.partial, snapshot.currentChoice]
    : snapshot.partial;
  const currentPathSet = new Set<string>(pathKeys(activePath));

  const phase = currentStep?.phase;
  const solutionPathValues =
    phase === "exit" && snapshot.solutions.length > 0
      ? snapshot.solutions[snapshot.solutions.length - 1]
      : [];
  const solutionPathSet = new Set<string>(pathKeys(solutionPathValues));

  const sampledKeys = sampleKeys(tree, snapshot.detailMode ?? "detailed", currentPathSet, solutionPathSet);
  const sampledNodes = [...sampledKeys]
    .map((key) => tree.get(key))
    .filter((node): node is TreeNode => Boolean(node));

  const perDepth = new Map<number, TreeNode[]>();
  for (const node of sampledNodes) {
    const list = perDepth.get(node.depth) ?? [];
    list.push(node);
    perDepth.set(node.depth, list);
  }

  for (const [, list] of perDepth) {
    list.sort((a, b) => {
      const av = parsePathValues(a.key);
      const bv = parsePathValues(b.key);
      for (let i = 0; i < Math.max(av.length, bv.length); i += 1) {
        const diff = (av[i] ?? -1) - (bv[i] ?? -1);
        if (diff !== 0) {
          return diff;
        }
      }
      return 0;
    });
  }

  const maxDepth = Math.max(...[...perDepth.keys()]);
  const maxCountInDepth = Math.max(...[...perDepth.values()].map((nodes) => nodes.length));
  const width = Math.max(LAYOUT.minWidth, maxCountInDepth * 68 + LAYOUT.padX * 2);
  const height = Math.max(220, (maxDepth + 1) * LAYOUT.levelGap + LAYOUT.padY * 2);

  const positions = new Map<string, { x: number; y: number }>();
  for (let depth = 0; depth <= maxDepth; depth += 1) {
    const nodes = perDepth.get(depth) ?? [];
    const count = nodes.length;
    for (let idx = 0; idx < count; idx += 1) {
      const x = count <= 1
        ? width / 2
        : LAYOUT.padX + (idx * (width - LAYOUT.padX * 2)) / (count - 1);
      const y = LAYOUT.padY + depth * LAYOUT.levelGap;
      positions.set(nodes[idx].key, { x, y });
    }
  }

  const laneDepthMax = Math.max(snapshot.depth + 1, maxDepth);
  const activeKey = pathKey(activePath);

  return (
    <CanvasFrame
      hasData
      header={(
        <div className="grid gap-2 text-sm text-[var(--color-fg-muted)] lg:grid-cols-2">
          <p className="font-semibold text-[var(--color-fg)]">Backtracking Tree</p>
          <p>phase: <span className="font-semibold text-[var(--color-fg)]">{phase ?? "-"}</span></p>
          <p>nodes: {sampledNodes.length} / {tree.size} (max 200)</p>
          <p>depth: {snapshot.depth}, currentChoice: {snapshot.currentChoice ?? "-"}</p>
        </div>
      )}
      message={snapshot.message}
      legend={(
        <div className="flex flex-wrap gap-2">
          <Badge tone="danger">prune</Badge>
          <Badge tone="success">solution(exit)</Badge>
          <Badge tone="info">current path</Badge>
          <Badge tone="neutral">normal</Badge>
        </div>
      )}
    >
      <div className="overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <svg width={width} height={height}>
          {[...sampledNodes].map((node) => {
            if (!node.parentKey) {
              return null;
            }
            const from = positions.get(node.parentKey);
            const to = positions.get(node.key);
            if (!from || !to) {
              return null;
            }
            return (
              <line
                key={`edge-${node.key}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="var(--viz-grid-stroke)"
                strokeWidth={1.5}
              />
            );
          })}

          {[...sampledNodes].map((node) => {
            const pos = positions.get(node.key);
            if (!pos) {
              return null;
            }
            const color = colorForNode(
              node.key,
              phase,
              activeKey,
              currentPathSet,
              solutionPathSet,
            );

            return (
              <g key={`node-${node.key}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={LAYOUT.nodeRadius}
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth={2}
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  style={{ fill: color.text }}
                  className="text-[10px] font-semibold"
                >
                  {node.value === null ? "R" : String(node.value)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <section className="rounded-lg border border-[var(--color-border)] p-3">
        <p className="text-sm font-semibold text-[var(--color-fg)]">Depth Lane</p>
        <div className="mt-2 space-y-1 text-sm">
          {Array.from({ length: laneDepthMax + 1 }).map((_, depth) => {
            const chosen = snapshot.partial[depth];
            const isActiveDepth = depth === snapshot.depth;
            const laneCandidates = isActiveDepth ? snapshot.candidates : [];
            return (
              <div key={`lane-${depth}`} className="flex min-h-7 items-center gap-2">
                <span className="w-16 text-xs font-semibold text-[var(--color-fg-muted)]">depth {depth}</span>
                <span className="w-20 text-xs text-[var(--color-fg-muted)]">
                  choice: {chosen === undefined ? "-" : chosen}
                </span>
                <div className="flex flex-wrap gap-1">
                  {laneCandidates.length === 0 ? (
                    <span className="text-xs text-[var(--color-fg-muted)]">candidates -</span>
                  ) : (
                    laneCandidates.map((candidate) => {
                      const isCurrent = isActiveDepth && snapshot.currentChoice === candidate;
                      return (
                        <span
                          key={`cand-${depth}-${candidate}`}
                          className={`rounded border px-1.5 py-0.5 text-xs ${
                            isCurrent
                              ? "border-[var(--viz-bt-lane-current-stroke)] bg-[var(--viz-bt-lane-current-fill)] text-[var(--viz-bt-lane-current-text)]"
                              : "border-[var(--viz-bt-lane-candidate-stroke)] bg-[var(--viz-bt-lane-candidate-fill)] text-[var(--viz-bt-lane-candidate-text)]"
                          }`}
                        >
                          {candidate}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
          색상: prune(빨강), solution(exit, 초록), 현재 경로(파랑)
        </p>
      </section>
    </CanvasFrame>
  );
}
