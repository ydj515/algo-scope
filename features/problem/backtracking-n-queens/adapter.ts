import type { ProblemTraceAdapter } from "@/features/trace/adapter";
import type { BacktrackingSnapshot } from "@/features/problem/backtracking/types";
import { runBacktrackingEngine } from "../backtracking/engine";

export type BacktrackingNQueensInput = {
  n: string;
  dedupeSymmetry: string;
  stopAfterFirst: string;
  detailMode: string;
  maxSteps: string;
};

function parseInput(input: BacktrackingNQueensInput) {
  const n = Number(input.n);
  const maxSteps = Number(input.maxSteps);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("n은 1 이상의 정수여야 합니다.");
  }
  if (!Number.isInteger(maxSteps) || maxSteps <= 0) {
    throw new Error("maxSteps는 1 이상의 정수여야 합니다.");
  }

  return {
    n,
    maxSteps,
    dedupeSymmetry: input.dedupeSymmetry === "true",
    stopAfterFirst: input.stopAfterFirst === "true",
    detailMode: input.detailMode === "summary" ? "summary" : "detailed",
  } as const;
}

function isValidQueen(partial: number[], depth: number, choice: number): boolean {
  for (let row = 0; row < partial.length; row += 1) {
    const col = partial[row];
    if (col === choice) {
      return false;
    }
    if (Math.abs(col - choice) === Math.abs(row - depth)) {
      return false;
    }
  }
  return true;
}

function transformSolution(
  solution: number[],
  n: number,
  transform: (row: number, col: number, size: number) => [number, number],
): number[] {
  const transformed = Array.from({ length: n }, () => -1);

  for (let row = 0; row < n; row += 1) {
    const col = solution[row];
    const [nr, nc] = transform(row, col, n);
    transformed[nr] = nc;
  }

  return transformed;
}

function canonicalSymmetryKey(solution: number[], n: number): string {
  const transforms = [
    (r: number, c: number): [number, number] => [r, c],
    (r: number, c: number, size: number): [number, number] => [c, size - 1 - r],
    (r: number, c: number, size: number): [number, number] => [size - 1 - r, size - 1 - c],
    (r: number, c: number, size: number): [number, number] => [size - 1 - c, r],
    (r: number, c: number, size: number): [number, number] => [r, size - 1 - c],
    (r: number, c: number, size: number): [number, number] => [size - 1 - c, size - 1 - r],
    (r: number, c: number, size: number): [number, number] => [size - 1 - r, c],
    (r: number, c: number): [number, number] => [c, r],
  ] as const;

  const keys = transforms.map((tf) => transformSolution(solution, n, tf).join(","));
  keys.sort();
  return keys[0];
}

function dedupeSymmetricSolutions(solutions: number[][], n: number): number[][] {
  const seen = new Set<string>();
  const deduped: number[][] = [];

  for (const solution of solutions) {
    const key = canonicalSymmetryKey(solution, n);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push([...solution]);
  }

  return deduped;
}

function runNQueens(input: BacktrackingNQueensInput) {
  const parsed = parseInput(input);
  const candidates = Array.from({ length: parsed.n }, (_, idx) => idx);
  const result = runBacktrackingEngine(
    {
      length: parsed.n,
      candidates,
      isValid: isValidQueen,
      isGoal: (_partial, depth) => depth === parsed.n,
      snapshotEnhancer: (snapshot) => ({
        ...snapshot,
        boardSize: parsed.n,
        queenCols: [...snapshot.partial],
      }),
    },
    {
      stopAfterFirst: parsed.stopAfterFirst,
      detailMode: parsed.detailMode,
      maxSteps: parsed.maxSteps,
    },
  );

  if (!parsed.dedupeSymmetry) {
    return result;
  }

  const dedupedSolutions = dedupeSymmetricSolutions(result.finalSnapshot.solutions, parsed.n);
  if (dedupedSolutions.length === result.finalSnapshot.solutions.length) {
    return result;
  }

  const finalSnapshot: BacktrackingSnapshot = {
    ...result.finalSnapshot,
    solutions: dedupedSolutions,
    message: `${result.finalSnapshot.message ?? "탐색을 완료했습니다."} (대칭 해 제거 적용)`,
  };

  const steps = [...result.steps];
  if (steps.length > 0) {
    const lastIndex = steps.length - 1;
    const lastStep = steps[lastIndex];
    steps[lastIndex] = {
      ...lastStep,
      snapshot: {
        ...lastStep.snapshot,
        solutions: dedupedSolutions,
        message: finalSnapshot.message,
      },
    };
  }

  return {
    steps,
    finalSnapshot,
  };
}

export const backtrackingNQueensAdapter: ProblemTraceAdapter<
  BacktrackingNQueensInput,
  BacktrackingSnapshot
> = {
  id: "backtracking-n-queens",
  title: "Backtracking N-Queens Trace",
  description: "N-Queens 백트래킹 탐색을 단계별로 시각화합니다.",
  inputFields: [
    { key: "n", label: "n", type: "number", helperText: "체스판 크기 (n x n)" },
    {
      key: "dedupeSymmetry",
      label: "dedupeSymmetry",
      type: "checkbox",
      helperText: "true면 회전/반사로 같은 해를 하나로 묶어 표시",
    },
    {
      key: "stopAfterFirst",
      label: "stopAfterFirst",
      type: "checkbox",
      helperText: "true면 첫 해 발견 즉시 종료",
    },
    {
      key: "detailMode",
      label: "detailMode",
      type: "select",
      options: [
        { label: "detailed", value: "detailed" },
        { label: "summary", value: "summary" },
      ],
      helperText: "상세/요약 step 밀도 조절",
    },
    {
      key: "maxSteps",
      label: "maxSteps",
      type: "number",
      helperText: "step 상한. 도달 시 중단",
    },
  ],
  createDefaultInput: () => ({
    n: "8",
    dedupeSymmetry: "false",
    stopAfterFirst: "true",
    detailMode: "summary",
    maxSteps: "400",
  }),
  serializeInput: (input) => JSON.stringify(input, null, 2),
  parseInputText: (text) => {
    try {
      const parsed = JSON.parse(text) as Partial<BacktrackingNQueensInput>;
      const value: BacktrackingNQueensInput = {
        n: String(parsed.n ?? ""),
        dedupeSymmetry: parsed.dedupeSymmetry === "true" ? "true" : "false",
        stopAfterFirst: parsed.stopAfterFirst === "true" ? "true" : "false",
        detailMode: parsed.detailMode === "summary" ? "summary" : "detailed",
        maxSteps: String(parsed.maxSteps ?? "400"),
      };
      parseInput(value);
      return { ok: true, value };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "입력 파싱 실패" };
    }
  },
  run: (input) => {
    try {
      return runNQueens(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : "실행 실패";
      const fallback: BacktrackingSnapshot = {
        depth: 0,
        partial: [],
        currentChoice: null,
        candidates: [],
        solutions: [],
        stepsEmitted: 0,
        visitedNodes: 0,
        pruned: 0,
        stoppedBy: "none",
        message,
      };
      return {
        steps: [
          {
            id: "bt-nq-error",
            title: "입력 오류",
            description: message,
            phase: "prune",
            snapshot: fallback,
            complexity: { timeWorst: "O(b^d)", spaceWorst: "O(d)" },
            isError: true,
          },
        ],
        finalSnapshot: fallback,
      };
    }
  },
  getSnapshotSummary: (snapshot) => ({
    depth: snapshot.depth,
    solutions: snapshot.solutions.length,
    visited: snapshot.visitedNodes,
    pruned: snapshot.pruned,
    stoppedBy: snapshot.stoppedBy,
  }),
};
