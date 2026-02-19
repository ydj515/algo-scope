"use client";

import type { GridBfsSnapshot } from "@/features/problem/grid-bfs/adapter";
import { Badge } from "@/features/ui/components/badge";
import { CanvasFrame } from "@/features/ui/components/canvas-frame";

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
      <CanvasFrame
        hasData={false}
        emptyText="입력을 설정하고 Execute를 눌러주세요."
        className="h-[420px]"
      />
    );
  }

  const width = snapshot.cols * CELL_SIZE;
  const height = snapshot.rows * CELL_SIZE;
  const wallSet = new Set(snapshot.walls.map((cell) => `${cell.row},${cell.col}`));
  const visitedSet = new Set(snapshot.visited.map((cell) => `${cell.row},${cell.col}`));
  const frontierSet = new Set(snapshot.frontier.map((cell) => `${cell.row},${cell.col}`));
  const pathSet = new Set(snapshot.path.map((cell) => `${cell.row},${cell.col}`));

  return (
    <CanvasFrame
      hasData
      header={(
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[var(--color-fg)]">Grid BFS Canvas</p>
          <p className="text-xs text-[var(--color-fg-muted)]">
            rows={snapshot.rows}, cols={snapshot.cols}, frontier={snapshot.frontier.length}, visited={snapshot.visited.length}
          </p>
        </div>
      )}
      message={snapshot.message}
      legend={(
        <div className="flex flex-wrap gap-2">
          <Badge tone="neutral">미방문</Badge>
          <Badge tone="neutral" variant="outline">방문</Badge>
          <Badge tone="info">frontier</Badge>
          <Badge tone="warning">current</Badge>
          <Badge tone="success">최종 경로</Badge>
          <Badge tone="danger">벽</Badge>
        </div>
      )}
    >
      <div className="overflow-auto">
        <svg width={Math.max(width, 320)} height={Math.max(height, 120)} className="rounded-lg bg-[var(--color-surface)]">
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
              const cellValue = snapshot.matrixValues?.[row]?.[col];

              let fill = "var(--viz-cell-empty)";
              if (isWall) fill = "var(--viz-cell-wall)";
              else if (inPath) fill = "var(--viz-cell-path)";
              else if (isCurrent) fill = "var(--viz-cell-current)";
              else if (isGoal) fill = "var(--viz-cell-goal)";
              else if (isStart) fill = "var(--viz-cell-start)";
              else if (inFrontier) fill = "var(--viz-cell-frontier)";
              else if (isVisited) fill = "var(--viz-cell-visited)";

              return (
                <g key={`cell-${key}`}>
                  <rect x={x} y={y} width={CELL_SIZE} height={CELL_SIZE} fill={fill} stroke="var(--viz-grid-stroke)" strokeWidth={1} />
                  {snapshot.showCellValues && typeof cellValue === "number" && (
                    <text
                      x={x + CELL_SIZE / 2}
                      y={y + CELL_SIZE / 2 + 4}
                      textAnchor="middle"
                      fill={isWall ? "var(--viz-cell-text-inverse)" : "var(--viz-cell-text)"}
                      className="text-[10px]"
                    >
                      {cellValue}
                    </text>
                  )}
                  {(isStart || isGoal) && (
                    <text
                      x={x + CELL_SIZE / 2}
                      y={y + 12}
                      textAnchor="middle"
                      fill="var(--viz-cell-text)"
                      className="text-[10px] font-bold"
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
    </CanvasFrame>
  );
}
