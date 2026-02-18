"use client";

import type { BacktrackingSnapshot } from "@/features/problem/backtracking/types";

type Props = { snapshot: BacktrackingSnapshot | null };

const CELL = 40;

export function NQueensCanvas({ snapshot }: Props) {
  if (!snapshot || !snapshot.boardSize) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
        입력을 설정하고 Execute를 눌러주세요.
      </div>
    );
  }

  const n = snapshot.boardSize;
  const queens = snapshot.queenCols ?? [];

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4">
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
                  <rect x={x} y={y} width={CELL} height={CELL} fill={isDark ? "#cbd5e1" : "#f8fafc"} stroke="#94a3b8" strokeWidth={1} />
                  {hasQueen ? (
                    <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" className="fill-rose-700 text-sm font-bold">
                      Q
                    </text>
                  ) : null}
                </g>
              );
            }),
          )}
        </svg>
      </div>
      <p className="mt-2 text-sm text-zinc-700">현재 배치: [{queens.join(", ")}]</p>
    </section>
  );
}
