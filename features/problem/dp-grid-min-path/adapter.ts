import type { ProblemTraceAdapter } from "@/features/trace/adapter";
import type { DpCell, DpSnapshot } from "@/features/problem/dp/types";
import type { TraceResult, TraceStep } from "@/features/trace/types";

export type DpGridMinPathInput = {
  grid: string;
  detailMode: string;
  showPath: string;
};

const COMPLEXITY = { timeWorst: "O(R*C)", spaceWorst: "O(R*C)" };

function parseGrid(text: string): number[][] {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      line.split(/\s+/).map((token) => {
        const n = Number(token);
        if (!Number.isFinite(n)) {
          throw new Error("grid는 공백 구분 숫자 행렬이어야 합니다.");
        }
        return n;
      }),
    );

  if (rows.length === 0 || rows[0].length === 0) {
    throw new Error("grid가 비어 있습니다.");
  }

  const cols = rows[0].length;
  rows.forEach((row) => {
    if (row.length !== cols) {
      throw new Error("grid 각 행의 길이는 동일해야 합니다.");
    }
  });

  return rows;
}

function cloneTable(table: number[][]): number[][] {
  return table.map((row) => [...row]);
}

function makeStep(id: string, title: string, description: string, phase: TraceStep<DpSnapshot>["phase"], snapshot: DpSnapshot): TraceStep<DpSnapshot> {
  return { id, title, description, phase, snapshot, complexity: COMPLEXITY };
}

function reconstruct(dp: number[][]): DpCell[] {
  const rMax = dp.length - 1;
  const cMax = dp[0].length - 1;
  const path: DpCell[] = [];
  let r = rMax;
  let c = cMax;

  path.push({ row: r, col: c });
  while (!(r === 0 && c === 0)) {
    if (r === 0) c -= 1;
    else if (c === 0) r -= 1;
    else if (dp[r - 1][c] <= dp[r][c - 1]) r -= 1;
    else c -= 1;
    path.push({ row: r, col: c });
  }

  path.reverse();
  return path;
}

function runGridMinPath(input: DpGridMinPathInput): TraceResult<DpSnapshot> {
  const grid = parseGrid(input.grid);
  const rows = grid.length;
  const cols = grid[0].length;
  const dp = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));

  const mode = input.detailMode === "summary" ? "summary" : "detailed";
  const showPath = input.showPath === "true";

  const steps: Array<TraceStep<DpSnapshot>> = [];
  let sid = 1;

  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      if (i === 0 && j === 0) {
        dp[i][j] = grid[i][j];
      } else {
        const up = i > 0 ? dp[i - 1][j] : Number.POSITIVE_INFINITY;
        const left = j > 0 ? dp[i][j - 1] : Number.POSITIVE_INFINITY;
        dp[i][j] = Math.min(up, left) + grid[i][j];
      }

      if (mode === "detailed") {
        steps.push(
          makeStep(
            `gmp-${sid}`,
            "셀 갱신",
            `dp[${i}][${j}] = ${dp[i][j]}`,
            "update",
            {
              rows,
              cols,
              table: cloneTable(dp),
              focus: { row: i, col: j },
              changedCells: [{ row: i, col: j }],
              reconstructedPath: [],
              answer: dp[rows - 1][cols - 1],
              showPath,
              meta: { mode },
            },
          ),
        );
        sid += 1;
      }
    }

    if (mode === "summary") {
      steps.push(
        makeStep(
          `gmp-row-${i}`,
          "행 완료",
          `${i}행 계산을 완료했습니다.`,
          "enter",
          {
            rows,
            cols,
            table: cloneTable(dp),
            focus: { row: i, col: cols - 1 },
            changedCells: [],
            reconstructedPath: [],
            answer: dp[rows - 1][cols - 1],
            showPath,
            meta: { mode },
          },
        ),
      );
    }
  }

  const path = showPath ? reconstruct(dp) : [];

  const finalSnapshot: DpSnapshot = {
    rows,
    cols,
    table: cloneTable(dp),
    focus: { row: rows - 1, col: cols - 1 },
    changedCells: [],
    reconstructedPath: path,
    answer: dp[rows - 1][cols - 1],
    showPath,
    message: showPath ? "최소 비용 경로를 복원했습니다." : "답만 표시합니다.",
    meta: { mode },
  };

  steps.push(makeStep("gmp-exit", "계산 완료", `최소 경로 합: ${finalSnapshot.answer}`, "exit", finalSnapshot));

  return { steps, finalSnapshot };
}

export const dpGridMinPathAdapter: ProblemTraceAdapter<DpGridMinPathInput, DpSnapshot> = {
  id: "dp-grid-min-path",
  title: "Grid Min Path Sum DP Trace",
  description: "격자 최소 경로 합 DP를 테이블로 시각화합니다.",
  inputFields: [
    {
      key: "grid",
      label: "grid",
      type: "textarea",
      helperText: "공백 구분 숫자 행렬. 예: 1 3 1\\n1 5 1\\n4 2 1",
    },
    {
      key: "detailMode",
      label: "stepMode",
      type: "select",
      options: [
        { label: "상세(detailed)", value: "detailed" },
        { label: "요약(summary)", value: "summary" },
      ],
      helperText: "상세=셀 단위, 요약=행 단위",
    },
    {
      key: "showPath",
      label: "answerView",
      type: "select",
      options: [
        { label: "답만", value: "false" },
        { label: "복원 경로 포함", value: "true" },
      ],
      helperText: "최소 합 경로 복원 여부",
    },
  ],
  createDefaultInput: () => ({
    grid: "1 3 1\n1 5 1\n4 2 1",
    detailMode: "summary",
    showPath: "true",
  }),
  serializeInput: (input) => JSON.stringify(input, null, 2),
  parseInputText: (text) => {
    try {
      const parsed = JSON.parse(text) as Partial<DpGridMinPathInput>;
      const value: DpGridMinPathInput = {
        grid: String(parsed.grid ?? ""),
        detailMode: parsed.detailMode === "summary" ? "summary" : "detailed",
        showPath: parsed.showPath === "true" ? "true" : "false",
      };
      runGridMinPath(value);
      return { ok: true, value };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "입력 파싱 실패" };
    }
  },
  run: (input) => {
    try {
      return runGridMinPath(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : "실행 실패";
      const fallback: DpSnapshot = {
        rows: 1,
        cols: 1,
        table: [[0]],
        focus: null,
        changedCells: [],
        reconstructedPath: [],
        answer: 0,
        showPath: false,
        message,
      };
      return {
        steps: [
          {
            id: "dp-grid-min-path-error",
            title: "입력 오류",
            description: message,
            phase: "prune",
            snapshot: fallback,
            complexity: COMPLEXITY,
            isError: true,
          },
        ],
        finalSnapshot: fallback,
      };
    }
  },
  getSnapshotSummary: (snapshot) => ({
    rows: snapshot.rows,
    cols: snapshot.cols,
    answer: snapshot.answer,
    mode: String(snapshot.meta?.mode ?? "-"),
    pathLength: snapshot.reconstructedPath.length,
  }),
};
