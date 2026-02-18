"use client";

import type { GridBfsSnapshot } from "@/features/problem/grid-bfs/adapter";

type Props = {
  snapshot: GridBfsSnapshot | null;
};

const CELL_SIZE = 42;

function isSame(a: { row: number; col: number } | null, b: { row: number; col: number }) {
  if (!a) {
    return false;
  }
  return a.row === b.row && a.col === b.col;
}

export function GridBfsCanvas({ snapshot }: Props) {
  if (!snapshot) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
        입력을 설정하고 Execute를 눌러주세요.
      </div>
    );
  }

  const width = snapshot.cols * CELL_SIZE;
  const height = snapshot.rows * CELL_SIZE;
  const wallSet = new Set(snapshot.walls.map((cell) => `${cell.row},${cell.col}`));
  const visitedSet = new Set(snapshot.visited.map((cell) => `${cell.row},${cell.col}`));
  const frontierSet = new Set(snapshot.frontier.map((cell) => `${cell.row},${cell.col}`));
  const pathSet = new Set(snapshot.path.map((cell) => `${cell.row},${cell.col}`));

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="overflow-auto">
        <svg width={Math.max(width, 320)} height={Math.max(height, 120)} className="rounded-lg bg-white">
          {Array.from({ length: snapshot.rows }).map((_, row) =>
            Array.from({ length: snapshot.cols }).map((__, col) => {
              const key = `${row},${col}`;
              const cell = { row, col };
              const x = col * CELL_SIZE;
              const y = row * CELL_SIZE;

              const isStart = isSame(snapshot.start, cell);
              const isGoal = isSame(snapshot.goal, cell);
              const isCurrent = isSame(snapshot.current, cell);
              const isWall = wallSet.has(key);
              const inPath = pathSet.has(key);
              const inFrontier = frontierSet.has(key);
              const isVisited = visitedSet.has(key);

              let fill = "#ffffff";
              if (isWall) fill = "#0f172a";
              else if (inPath) fill = "#86efac";
              else if (isCurrent) fill = "#facc15";
              else if (isGoal) fill = "#fca5a5";
              else if (isStart) fill = "#93c5fd";
              else if (inFrontier) fill = "#bfdbfe";
              else if (isVisited) fill = "#e2e8f0";

              return (
                <g key={`cell-${key}`}>
                  <rect x={x} y={y} width={CELL_SIZE} height={CELL_SIZE} fill={fill} stroke="#94a3b8" strokeWidth={1} />
                  {(isStart || isGoal) && (
                    <text
                      x={x + CELL_SIZE / 2}
                      y={y + CELL_SIZE / 2 + 4}
                      textAnchor="middle"
                      className="fill-zinc-900 text-[11px] font-bold"
                    >
                      {isStart ? "S" : "G"}
                    </text>
                  )}
                </g>
              );
            }),
          )}
        </svg>
      </div>

      <div className="mt-3 grid gap-2 text-xs text-zinc-600 sm:grid-cols-3 lg:grid-cols-6">
        <span>흰색: 미방문</span>
        <span>회색: 방문</span>
        <span>파랑: frontier</span>
        <span>노랑: current</span>
        <span>초록: 최종 경로</span>
        <span>검정: 벽</span>
      </div>

      {snapshot.message ? <p className="mt-2 text-sm text-zinc-700">{snapshot.message}</p> : null}
    </section>
  );
}
