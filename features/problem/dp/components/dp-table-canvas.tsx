"use client";

import type { DpSnapshot } from "@/features/problem/dp/types";
import { Badge } from "@/features/ui/components/badge";
import { CanvasFrame } from "@/features/ui/components/canvas-frame";

type Props = {
  snapshot: DpSnapshot | null;
};

const CELL = 42;

function key(row: number, col: number): string {
  return `${row},${col}`;
}

export function DpTableCanvas({ snapshot }: Props) {
  if (!snapshot) {
    return (
      <CanvasFrame
        hasData={false}
        emptyText="입력을 설정하고 Execute를 눌러주세요."
      />
    );
  }

  const width = snapshot.cols * CELL;
  const height = snapshot.rows * CELL;
  const changed = new Set(snapshot.changedCells.map((cell) => key(cell.row, cell.col)));
  const path = new Set(snapshot.reconstructedPath.map((cell) => key(cell.row, cell.col)));
  const focusKey = snapshot.focus ? key(snapshot.focus.row, snapshot.focus.col) : "";

  return (
    <CanvasFrame
      hasData
      header={(
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[var(--color-fg)]">DP Table Canvas</p>
          <p className="text-xs text-[var(--color-fg-muted)]">
            rows={snapshot.rows}, cols={snapshot.cols}, answer={snapshot.answer}
          </p>
        </div>
      )}
      message={snapshot.message}
      legend={(
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="warning">현재 셀</Badge>
          <Badge tone="info">갱신 셀</Badge>
          <Badge tone="success">복원 경로</Badge>
          <Badge tone="neutral">일반 셀</Badge>
        </div>
      )}
    >
      <div className="overflow-auto">
        <svg width={Math.max(width, 320)} height={Math.max(height, 120)} className="rounded-lg bg-[var(--color-surface)]">
          {Array.from({ length: snapshot.rows }).map((_, row) =>
            Array.from({ length: snapshot.cols }).map((__, col) => {
              const x = col * CELL;
              const y = row * CELL;
              const k = key(row, col);

              let fill = "var(--viz-cell-empty)";
              if (path.has(k) && snapshot.showPath) fill = "var(--viz-cell-path)";
              if (changed.has(k)) fill = "var(--viz-cell-changed)";
              if (k === focusKey) fill = "var(--viz-cell-focus)";

              return (
                <g key={`dp-cell-${k}`}>
                  <rect x={x} y={y} width={CELL} height={CELL} fill={fill} stroke="var(--viz-grid-stroke)" strokeWidth={1} />
                  <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" className="fill-[var(--viz-cell-text)] text-[11px] font-semibold">
                    {snapshot.table[row][col]}
                  </text>
                </g>
              );
            }),
          )}
        </svg>
      </div>
    </CanvasFrame>
  );
}
