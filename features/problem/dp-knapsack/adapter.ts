import type { ProblemTraceAdapter } from "@/features/trace/adapter";
import type { DpCell, DpSnapshot } from "@/features/problem/dp/types";
import type { TraceResult, TraceStep } from "@/features/trace/types";

export type DpKnapsackInput = {
  weights: string;
  values: string;
  capacity: string;
  tableMode: string;
  detailMode: string;
  showPath: string;
};

type KnapsackMode = "2d" | "1d";

type Complexity = { timeWorst: string; spaceWorst: string };

const COMPLEXITY_2D: Complexity = { timeWorst: "O(N*W)", spaceWorst: "O(N*W)" };
const COMPLEXITY_1D: Complexity = { timeWorst: "O(N*W)", spaceWorst: "O(W)" };

function parseNumbers(label: string, raw: string): number[] {
  const items = raw
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => Number(token));

  if (items.length === 0 || items.some((n) => !Number.isFinite(n))) {
    throw new Error(`${label}는 쉼표 구분 숫자 목록이어야 합니다.`);
  }
  return items;
}

function cloneTable(table: number[][]): number[][] {
  return table.map((row) => [...row]);
}

function makeStep(
  id: string,
  title: string,
  description: string,
  phase: TraceStep<DpSnapshot>["phase"],
  snapshot: DpSnapshot,
  complexity: Complexity,
): TraceStep<DpSnapshot> {
  return { id, title, description, phase, snapshot, complexity };
}

function reconstructPicked2D(
  dp: number[][],
  weights: number[],
  values: number[],
  cap: number,
): { path: DpCell[]; picked: number[] } {
  const path: DpCell[] = [];
  const picked: number[] = [];
  let i = weights.length;
  let w = cap;

  while (i > 0 && w >= 0) {
    path.push({ row: i, col: w });
    const without = dp[i - 1][w];
    const withItem =
      w >= weights[i - 1]
        ? dp[i - 1][w - weights[i - 1]] + values[i - 1]
        : Number.NEGATIVE_INFINITY;

    if (withItem >= without && w >= weights[i - 1]) {
      picked.push(i - 1);
      w -= weights[i - 1];
    }

    i -= 1;
  }

  path.push({ row: 0, col: Math.max(w, 0) });
  path.reverse();
  picked.reverse();
  return { path, picked };
}

function runKnapsack2D(
  weights: number[],
  values: number[],
  capacity: number,
  detailMode: "summary" | "detailed",
  showPath: boolean,
): TraceResult<DpSnapshot> {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array.from({ length: capacity + 1 }, () => 0));
  const steps: Array<TraceStep<DpSnapshot>> = [];
  let sid = 1;

  for (let i = 1; i <= n; i += 1) {
    for (let w = 0; w <= capacity; w += 1) {
      const without = dp[i - 1][w];
      const withItem =
        w >= weights[i - 1]
          ? dp[i - 1][w - weights[i - 1]] + values[i - 1]
          : Number.NEGATIVE_INFINITY;
      const next = Math.max(without, withItem);
      const changed = dp[i][w] !== next;
      dp[i][w] = next;

      if (detailMode === "detailed" || changed) {
        steps.push(
          makeStep(
            `ks2d-${sid}`,
            "셀 갱신",
            `dp[${i}][${w}] = max(${without}, ${withItem}) = ${next}`,
            "update",
            {
              rows: n + 1,
              cols: capacity + 1,
              table: cloneTable(dp),
              focus: { row: i, col: w },
              changedCells: [{ row: i, col: w }],
              reconstructedPath: [],
              answer: dp[n][capacity],
              showPath,
              meta: { mode: detailMode, tableMode: "2d" },
            },
            COMPLEXITY_2D,
          ),
        );
        sid += 1;
      }
    }

    if (detailMode === "summary") {
      steps.push(
        makeStep(
          `ks2d-row-${i}`,
          "아이템 완료",
          `${i}번째 아이템 반영 완료`,
          "enter",
          {
            rows: n + 1,
            cols: capacity + 1,
            table: cloneTable(dp),
            focus: { row: i, col: capacity },
            changedCells: [],
            reconstructedPath: [],
            answer: dp[n][capacity],
            showPath,
            meta: { mode: detailMode, tableMode: "2d" },
          },
          COMPLEXITY_2D,
        ),
      );
    }
  }

  const restored = showPath
    ? reconstructPicked2D(dp, weights, values, capacity)
    : { path: [], picked: [] as number[] };

  const finalSnapshot: DpSnapshot = {
    rows: n + 1,
    cols: capacity + 1,
    table: cloneTable(dp),
    focus: { row: n, col: capacity },
    changedCells: [],
    reconstructedPath: restored.path,
    answer: dp[n][capacity],
    showPath,
    message: showPath
      ? `선택된 아이템 인덱스: [${restored.picked.join(", ")}]`
      : "답만 표시합니다.",
    meta: { mode: detailMode, tableMode: "2d" },
  };

  steps.push(
    makeStep(
      "ks2d-exit",
      "계산 완료",
      `최적값: ${finalSnapshot.answer}`,
      "exit",
      finalSnapshot,
      COMPLEXITY_2D,
    ),
  );

  return { steps, finalSnapshot };
}

function runKnapsack1D(
  weights: number[],
  values: number[],
  capacity: number,
  detailMode: "summary" | "detailed",
  showPath: boolean,
): TraceResult<DpSnapshot> {
  const n = weights.length;
  const dp = Array.from({ length: capacity + 1 }, () => 0);
  const parent: Array<{ prevCap: number; itemIndex: number } | null> = Array.from(
    { length: capacity + 1 },
    () => null,
  );

  const steps: Array<TraceStep<DpSnapshot>> = [];
  let sid = 1;

  for (let i = 0; i < n; i += 1) {
    for (let w = capacity; w >= weights[i]; w -= 1) {
      const without = dp[w];
      const withItem = dp[w - weights[i]] + values[i];
      if (withItem > without) {
        dp[w] = withItem;
        parent[w] = { prevCap: w - weights[i], itemIndex: i };

        if (detailMode === "detailed") {
          steps.push(
            makeStep(
              `ks1d-${sid}`,
              "셀 갱신",
              `dp[${w}] = max(${without}, ${withItem}) = ${dp[w]}`,
              "update",
              {
                rows: 1,
                cols: capacity + 1,
                table: [dp.slice()],
                focus: { row: 0, col: w },
                changedCells: [{ row: 0, col: w }],
                reconstructedPath: [],
                answer: dp[capacity],
                showPath,
                meta: { mode: detailMode, tableMode: "1d" },
              },
              COMPLEXITY_1D,
            ),
          );
          sid += 1;
        }
      }
    }

    if (detailMode === "summary") {
      steps.push(
        makeStep(
          `ks1d-item-${i}`,
          "아이템 완료",
          `${i + 1}번째 아이템 반영 후 상태`,
          "enter",
          {
            rows: 1,
            cols: capacity + 1,
            table: [dp.slice()],
            focus: { row: 0, col: capacity },
            changedCells: [],
            reconstructedPath: [],
            answer: dp[capacity],
            showPath,
            meta: { mode: detailMode, tableMode: "1d" },
          },
          COMPLEXITY_1D,
        ),
      );
    }
  }

  const path: DpCell[] = [];
  const picked: number[] = [];
  if (showPath) {
    let cursor = capacity;
    const seen = new Set<number>();
    while (parent[cursor] && !seen.has(cursor)) {
      seen.add(cursor);
      path.push({ row: 0, col: cursor });
      picked.push(parent[cursor]!.itemIndex);
      cursor = parent[cursor]!.prevCap;
    }
    path.push({ row: 0, col: cursor });
    path.reverse();
    picked.reverse();
  }

  const finalSnapshot: DpSnapshot = {
    rows: 1,
    cols: capacity + 1,
    table: [dp.slice()],
    focus: { row: 0, col: capacity },
    changedCells: [],
    reconstructedPath: path,
    answer: dp[capacity],
    showPath,
    message: showPath
      ? `1D 추적으로 선택된 아이템 인덱스: [${picked.join(", ")}]`
      : "답만 표시합니다.",
    meta: { mode: detailMode, tableMode: "1d" },
  };

  steps.push(
    makeStep(
      "ks1d-exit",
      "계산 완료",
      `최적값: ${finalSnapshot.answer}`,
      "exit",
      finalSnapshot,
      COMPLEXITY_1D,
    ),
  );

  return { steps, finalSnapshot };
}

function runKnapsack(input: DpKnapsackInput): TraceResult<DpSnapshot> {
  const weights = parseNumbers("weights", input.weights);
  const values = parseNumbers("values", input.values);
  if (weights.length !== values.length) {
    throw new Error("weights와 values 길이는 같아야 합니다.");
  }
  if (weights.some((w) => !Number.isInteger(w) || w <= 0)) {
    throw new Error("weights는 1 이상의 정수여야 합니다.");
  }

  const capacity = Number(input.capacity);
  if (!Number.isInteger(capacity) || capacity < 0) {
    throw new Error("capacity는 0 이상의 정수여야 합니다.");
  }

  const detailMode = input.detailMode === "summary" ? "summary" : "detailed";
  const showPath = input.showPath === "true";
  const tableMode: KnapsackMode = input.tableMode === "1d" ? "1d" : "2d";

  if (tableMode === "1d") {
    return runKnapsack1D(weights, values, capacity, detailMode, showPath);
  }

  return runKnapsack2D(weights, values, capacity, detailMode, showPath);
}

export const dpKnapsackAdapter: ProblemTraceAdapter<DpKnapsackInput, DpSnapshot> = {
  id: "dp-knapsack",
  title: "0/1 Knapsack DP Trace",
  description: "0/1 Knapsack DP 테이블(2D/1D 최적화)을 단계별로 시각화합니다.",
  inputFields: [
    { key: "weights", label: "weights", type: "text", helperText: "예: 2,3,4,5 (양의 정수)" },
    { key: "values", label: "values", type: "text", helperText: "예: 3,4,5,8" },
    { key: "capacity", label: "capacity", type: "number", helperText: "배낭 최대 무게" },
    {
      key: "tableMode",
      label: "tableMode",
      type: "select",
      options: [
        { label: "2D 테이블", value: "2d" },
        { label: "1D 최적화(O(W))", value: "1d" },
      ],
      helperText: "1D는 공간 O(W)로 동작",
    },
    {
      key: "detailMode",
      label: "stepMode",
      type: "select",
      options: [
        { label: "상세(detailed)", value: "detailed" },
        { label: "요약(summary)", value: "summary" },
      ],
      helperText: "상세=갱신마다, 요약=아이템 단위",
    },
    {
      key: "showPath",
      label: "answerView",
      type: "checkbox",
      helperText: "선택 아이템 복원 표시",
    },
  ],
  createDefaultInput: () => ({
    weights: "2,3,4,5",
    values: "3,4,5,8",
    capacity: "8",
    tableMode: "2d",
    detailMode: "summary",
    showPath: "true",
  }),
  serializeInput: (input) => JSON.stringify(input, null, 2),
  parseInputText: (text) => {
    try {
      const parsed = JSON.parse(text) as Partial<DpKnapsackInput>;
      const value: DpKnapsackInput = {
        weights: String(parsed.weights ?? ""),
        values: String(parsed.values ?? ""),
        capacity: String(parsed.capacity ?? "0"),
        tableMode: parsed.tableMode === "1d" ? "1d" : "2d",
        detailMode: parsed.detailMode === "summary" ? "summary" : "detailed",
        showPath: parsed.showPath === "true" ? "true" : "false",
      };
      runKnapsack(value);
      return { ok: true, value };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "입력 파싱 실패" };
    }
  },
  run: (input) => {
    try {
      return runKnapsack(input);
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
            id: "dp-knapsack-error",
            title: "입력 오류",
            description: message,
            phase: "prune",
            snapshot: fallback,
            complexity: COMPLEXITY_2D,
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
    tableMode: String(snapshot.meta?.tableMode ?? "-"),
    pathLength: snapshot.reconstructedPath.length,
  }),
};
