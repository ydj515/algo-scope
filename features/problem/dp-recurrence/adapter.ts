import type { ProblemTraceAdapter } from "@/features/trace/adapter";
import type { DpCell, DpSnapshot } from "@/features/problem/dp/types";
import type { TraceResult, TraceStep } from "@/features/trace/types";

export type DpRecurrenceInput = {
  rows: string;
  cols: string;
  baseValue: string;
  firstRowInit: string;
  firstColInit: string;
  recurrence: string;
  detailMode: string;
  showPath: string;
};

const COMPLEXITY = { timeWorst: "O(R*C)", spaceWorst: "O(R*C)" };

function makeTable(rows: number, cols: number, value: number): number[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => value));
}

function cloneTable(table: number[][]): number[][] {
  return table.map((row) => [...row]);
}

function toInt(label: string, v: string, min = 1): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n < min) {
    throw new Error(`${label}는 ${min} 이상의 정수여야 합니다.`);
  }
  return n;
}

function compileRecurrence(expression: string) {
  const source = expression.trim();
  if (source.length === 0) {
    throw new Error("recurrence가 비어 있습니다.");
  }
  return new Function(
    "up",
    "left",
    "diag",
    "i",
    "j",
    "min",
    "max",
    "abs",
    `return (${source});`,
  ) as (
    up: number,
    left: number,
    diag: number,
    i: number,
    j: number,
    min: Math["min"],
    max: Math["max"],
    abs: Math["abs"],
  ) => number;
}

function compileBoundaryRow(expression: string) {
  const source = expression.trim();
  if (source.length === 0) {
    throw new Error("firstRowInit이 비어 있습니다.");
  }

  return new Function(
    "left",
    "j",
    "min",
    "max",
    "abs",
    `return (${source});`,
  ) as (
    left: number,
    j: number,
    min: Math["min"],
    max: Math["max"],
    abs: Math["abs"],
  ) => number;
}

function compileBoundaryCol(expression: string) {
  const source = expression.trim();
  if (source.length === 0) {
    throw new Error("firstColInit이 비어 있습니다.");
  }

  return new Function(
    "up",
    "i",
    "min",
    "max",
    "abs",
    `return (${source});`,
  ) as (
    up: number,
    i: number,
    min: Math["min"],
    max: Math["max"],
    abs: Math["abs"],
  ) => number;
}

function reconstructByMin(table: number[][]): DpCell[] {
  const rows = table.length;
  const cols = table[0]?.length ?? 0;
  if (rows === 0 || cols === 0) {
    return [];
  }

  const path: DpCell[] = [];
  let r = rows - 1;
  let c = cols - 1;
  path.push({ row: r, col: c });

  while (!(r === 0 && c === 0)) {
    const candidates: Array<{ row: number; col: number; value: number }> = [];
    if (r > 0) candidates.push({ row: r - 1, col: c, value: table[r - 1][c] });
    if (c > 0) candidates.push({ row: r, col: c - 1, value: table[r][c - 1] });
    if (r > 0 && c > 0) candidates.push({ row: r - 1, col: c - 1, value: table[r - 1][c - 1] });

    candidates.sort((a, b) => a.value - b.value);
    const best = candidates[0];
    r = best.row;
    c = best.col;
    path.push({ row: r, col: c });
  }

  path.reverse();
  return path;
}

function makeStep(
  id: string,
  title: string,
  description: string,
  phase: TraceStep<DpSnapshot>["phase"],
  snapshot: DpSnapshot,
): TraceStep<DpSnapshot> {
  return {
    id,
    title,
    description,
    phase,
    snapshot,
    complexity: COMPLEXITY,
  };
}

function parseInput(input: DpRecurrenceInput) {
  return {
    rows: toInt("rows", input.rows),
    cols: toInt("cols", input.cols),
    baseValue: Number(input.baseValue || "0"),
    firstRowInit: input.firstRowInit,
    firstColInit: input.firstColInit,
    recurrence: input.recurrence,
    detailMode: input.detailMode === "summary" ? "summary" : "detailed",
    showPath: input.showPath === "true",
  } as const;
}

function runRecurrence(input: DpRecurrenceInput): TraceResult<DpSnapshot> {
  const parsed = parseInput(input);
  const fn = compileRecurrence(parsed.recurrence);
  const rowInit = compileBoundaryRow(parsed.firstRowInit);
  const colInit = compileBoundaryCol(parsed.firstColInit);
  const table = makeTable(parsed.rows, parsed.cols, parsed.baseValue);
  const steps: Array<TraceStep<DpSnapshot>> = [];

  let stepId = 1;

  for (let i = 0; i < parsed.rows; i += 1) {
    for (let j = 0; j < parsed.cols; j += 1) {
      if (i === 0 && j === 0) {
        continue;
      }

      const up = i > 0 ? table[i - 1][j] : 0;
      const left = j > 0 ? table[i][j - 1] : 0;
      const diag = i > 0 && j > 0 ? table[i - 1][j - 1] : 0;

      const next = Number(
        i === 0
          ? rowInit(left, j, Math.min, Math.max, Math.abs)
          : j === 0
            ? colInit(up, i, Math.min, Math.max, Math.abs)
            : fn(up, left, diag, i, j, Math.min, Math.max, Math.abs),
      );

      if (!Number.isFinite(next)) {
        throw new Error("recurrence 결과가 숫자가 아닙니다.");
      }

      const before = table[i][j];
      table[i][j] = next;

      if (parsed.detailMode === "detailed" || before !== next) {
        steps.push(
          makeStep(
            `rec-${stepId}`,
            "셀 갱신",
            `dp[${i}][${j}] = ${next} (up=${up}, left=${left}, diag=${diag})`,
            "update",
            {
              rows: parsed.rows,
              cols: parsed.cols,
              table: cloneTable(table),
              focus: { row: i, col: j },
              changedCells: [{ row: i, col: j }],
              reconstructedPath: [],
              answer: table[parsed.rows - 1][parsed.cols - 1],
              showPath: parsed.showPath,
              meta: { mode: parsed.detailMode },
            },
          ),
        );
        stepId += 1;
      }
    }

    if (parsed.detailMode === "summary") {
      steps.push(
        makeStep(
          `rec-row-${i}`,
          "행 완료",
          `${i}행 계산을 완료했습니다.`,
          "enter",
          {
            rows: parsed.rows,
            cols: parsed.cols,
            table: cloneTable(table),
            focus: { row: i, col: parsed.cols - 1 },
            changedCells: [],
            reconstructedPath: [],
            answer: table[parsed.rows - 1][parsed.cols - 1],
            showPath: parsed.showPath,
            meta: { mode: parsed.detailMode },
          },
        ),
      );
    }
  }

  const path = parsed.showPath ? reconstructByMin(table) : [];
  const finalSnapshot: DpSnapshot = {
    rows: parsed.rows,
    cols: parsed.cols,
    table: cloneTable(table),
    focus: { row: parsed.rows - 1, col: parsed.cols - 1 },
    changedCells: [],
    reconstructedPath: path,
    answer: table[parsed.rows - 1][parsed.cols - 1],
    showPath: parsed.showPath,
    message: parsed.showPath
      ? "min predecessor 휴리스틱으로 경로를 복원했습니다."
      : "답만 표시합니다.",
    meta: { mode: parsed.detailMode },
  };

  steps.push(
    makeStep(
      "rec-exit",
      "계산 완료",
      `최종 답: ${finalSnapshot.answer}`,
      "exit",
      finalSnapshot,
    ),
  );

  return { steps, finalSnapshot };
}

export const dpRecurrenceAdapter: ProblemTraceAdapter<DpRecurrenceInput, DpSnapshot> = {
  id: "dp-recurrence",
  title: "DP Recurrence Trace",
  description: "점화식을 받아 DP 테이블을 채우고 step 단위로 시각화합니다.",
  inputFields: [
    { key: "rows", label: "rows", type: "number", helperText: "테이블 행 개수" },
    { key: "cols", label: "cols", type: "number", helperText: "테이블 열 개수" },
    { key: "baseValue", label: "baseValue", type: "number", helperText: "초기값(dp[0][0] 포함)" },
    {
      key: "firstRowInit",
      label: "firstRowInit",
      type: "text",
      helperText: "첫 행 초기식. 사용 변수: left,j / 함수: min,max,abs",
      placeholder: "left + 1",
    },
    {
      key: "firstColInit",
      label: "firstColInit",
      type: "text",
      helperText: "첫 열 초기식. 사용 변수: up,i / 함수: min,max,abs",
      placeholder: "up + 1",
    },
    {
      key: "recurrence",
      label: "recurrence",
      type: "text",
      helperText: "사용 가능 변수: up,left,diag,i,j / 함수: min,max,abs",
      placeholder: "min(up, left) + 1",
    },
    {
      key: "detailMode",
      label: "stepMode",
      type: "select",
      options: [
        { label: "상세(detailed)", value: "detailed" },
        { label: "요약(summary)", value: "summary" },
      ],
      helperText: "상세=셀 단위, 요약=행/변경 중심",
    },
    {
      key: "showPath",
      label: "answerView",
      type: "select",
      options: [
        { label: "답만", value: "false" },
        { label: "복원 경로 포함", value: "true" },
      ],
      helperText: "복원 경로는 min predecessor 휴리스틱 사용",
    },
  ],
  createDefaultInput: () => ({
    rows: "5",
    cols: "6",
    baseValue: "0",
    firstRowInit: "left + 1",
    firstColInit: "up + 1",
    recurrence: "min(up, left) + 1",
    detailMode: "summary",
    showPath: "true",
  }),
  serializeInput: (input) => JSON.stringify(input, null, 2),
  parseInputText: (text) => {
    try {
      const parsed = JSON.parse(text) as Partial<DpRecurrenceInput>;
      const value: DpRecurrenceInput = {
        rows: String(parsed.rows ?? ""),
        cols: String(parsed.cols ?? ""),
        baseValue: String(parsed.baseValue ?? "0"),
        firstRowInit: String(parsed.firstRowInit ?? "left + 1"),
        firstColInit: String(parsed.firstColInit ?? "up + 1"),
        recurrence: String(parsed.recurrence ?? ""),
        detailMode: parsed.detailMode === "summary" ? "summary" : "detailed",
        showPath: parsed.showPath === "true" ? "true" : "false",
      };
      parseInput(value);
      compileBoundaryRow(value.firstRowInit);
      compileBoundaryCol(value.firstColInit);
      compileRecurrence(value.recurrence);
      return { ok: true, value };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "입력 파싱 실패" };
    }
  },
  run: (input) => {
    try {
      return runRecurrence(input);
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
            id: "dp-recurrence-error",
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
