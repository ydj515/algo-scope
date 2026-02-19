"use client";

import type { BacktrackingSnapshot } from "@/features/problem/backtracking/types";
import { CanvasFrame } from "@/features/ui/components/canvas-frame";

type Props = { snapshot: BacktrackingSnapshot | null };

const CELL = 40;

export function NQueensCanvas({ snapshot }: Props) {
  if (!snapshot || !snapshot.boardSize) {
    return (
      <CanvasFrame
        hasData={false}
        emptyText="입력을 설정하고 Execute를 눌러주세요."
        className="h-[320px]"
      />
    );
  }

  const n = snapshot.boardSize;
  const queens = snapshot.queenCols ?? [];

  return (
    <CanvasFrame
      hasData
      header={(
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[var(--color-fg)]">N-Queens Board</p>
          <p className="text-xs text-[var(--color-fg-muted)]">n={n}, placed={queens.length}</p>
        </div>
      )}
      message={`현재 배치: [${queens.join(", ")}]`}
    >
      <div className="overflow-auto">
        <svg width={n * CELL} height={n * CELL}>
          {Array.from({ length: n }).map((_, row) =>
            Array.from({ length: n }).map((__, col) => {
              const x = col * CELL;
              const y = row * CELL;
              const isDark = (row + col) % 2 === 1;
              const hasQueen = queens[row] === col;

              return (
                <g key={`q-${row}-${col}`}>
                  <rect x={x} y={y} width={CELL} height={CELL} fill={isDark ? "var(--viz-nq-cell-dark)" : "var(--viz-nq-cell-light)"} stroke="var(--viz-grid-stroke)" strokeWidth={1} />
                  {hasQueen ? (
                    <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" className="fill-[var(--viz-nq-queen)] text-sm font-bold">
                      Q
                    </text>
                  ) : null}
                </g>
              );
            }),
          )}
        </svg>
      </div>
    </CanvasFrame>
  );
}
