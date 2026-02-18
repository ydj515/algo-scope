"use client";

import type { DpSnapshot } from "@/features/problem/dp/types";

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
      <div className="flex h-[380px] items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
        입력을 설정하고 Execute를 눌러주세요.
      </div>
    );
  }

  const width = snapshot.cols * CELL;
  const height = snapshot.rows * CELL;
  const changed = new Set(snapshot.changedCells.map((cell) => key(cell.row, cell.col)));
  const path = new Set(snapshot.reconstructedPath.map((cell) => key(cell.row, cell.col)));
  const focusKey = snapshot.focus ? key(snapshot.focus.row, snapshot.focus.col) : "";

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="overflow-auto">
        <svg width={Math.max(width, 320)} height={Math.max(height, 120)} className="rounded-lg bg-white">
          {Array.from({ length: snapshot.rows }).map((_, row) =>
            Array.from({ length: snapshot.cols }).map((__, col) => {
              const x = col * CELL;
              const y = row * CELL;
              const k = key(row, col);

              let fill = "#ffffff";
              if (path.has(k) && snapshot.showPath) fill = "#bbf7d0";
              if (changed.has(k)) fill = "#bfdbfe";
              if (k === focusKey) fill = "#facc15";

              return (
                <g key={`dp-cell-${k}`}>
                  <rect x={x} y={y} width={CELL} height={CELL} fill={fill} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" className="fill-zinc-800 text-[11px] font-semibold">
                    {snapshot.table[row][col]}
                  </text>
                </g>
              );
            }),
          )}
        </svg>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-zinc-600 sm:grid-cols-3 lg:grid-cols-5">
        <span>노랑: 현재 셀</span>
        <span>파랑: 갱신 셀</span>
        <span>초록: 복원 경로</span>
        <span>흰색: 일반 셀</span>
        <span>answer: {snapshot.answer}</span>
      </div>
      {snapshot.message ? <p className="mt-2 text-sm text-zinc-700">{snapshot.message}</p> : null}
    </section>
  );
}
