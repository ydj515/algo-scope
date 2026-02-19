import type { ProblemTraceAdapter } from "@/features/trace/adapter";
import type { BacktrackingSnapshot } from "@/features/problem/backtracking/types";
import { runBacktrackingEngine } from "../backtracking/engine";

export type BacktrackingGenericInput = {
  length: string;
  candidates: string;
  candidateGenerator: string;
  validPredicate: string;
  goalPredicate: string;
  stopAfterFirst: string;
  detailMode: string;
  maxSteps: string;
};

function parseCandidates(raw: string): number[] {
  const values = raw
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => Number(token));

  if (values.length === 0 || values.some((v) => !Number.isFinite(v))) {
    throw new Error("candidates는 쉼표 구분 숫자 목록이어야 합니다.");
  }

  return values;
}

function parseInput(input: BacktrackingGenericInput) {
  const length = Number(input.length);
  const maxSteps = Number(input.maxSteps);
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("length는 1 이상의 정수여야 합니다.");
  }
  if (!Number.isInteger(maxSteps) || maxSteps <= 0) {
    throw new Error("maxSteps는 1 이상의 정수여야 합니다.");
  }

  const candidates = parseCandidates(input.candidates);

  const valid = new Function(
    "partial",
    "depth",
    "choice",
    `return (${input.validPredicate});`,
  ) as (partial: number[], depth: number, choice: number) => boolean;

  const goal = new Function(
    "partial",
    "depth",
    "length",
    `return (${input.goalPredicate});`,
  ) as (partial: number[], depth: number, length: number) => boolean;

  const generatorExpression = input.candidateGenerator.trim().length > 0
    ? input.candidateGenerator
    : "candidates";
  const candidateGenerator = new Function(
    "partial",
    "depth",
    "candidates",
    `return (${generatorExpression});`,
  ) as (partial: number[], depth: number, candidates: number[]) => number[];

  return {
    length,
    maxSteps,
    candidates,
    valid,
    goal,
    candidateGenerator,
    stopAfterFirst: input.stopAfterFirst === "true",
    detailMode: input.detailMode === "summary" ? "summary" : "detailed",
  } as const;
}

function runGeneric(input: BacktrackingGenericInput) {
  const parsed = parseInput(input);
  return runBacktrackingEngine(
    {
      length: parsed.length,
      candidates: parsed.candidates,
      candidateGenerator: parsed.candidateGenerator,
      isValid: parsed.valid,
      isGoal: (partial, depth) => parsed.goal(partial, depth, parsed.length),
    },
    {
      stopAfterFirst: parsed.stopAfterFirst,
      detailMode: parsed.detailMode,
      maxSteps: parsed.maxSteps,
    },
  );
}

export const backtrackingGenericAdapter: ProblemTraceAdapter<
  BacktrackingGenericInput,
  BacktrackingSnapshot
> = {
  id: "backtracking-generic",
  title: "Backtracking Generic Trace",
  description: "제약식/목표식을 직접 정의해 백트래킹 과정을 시각화합니다.",
  inputFields: [
    { key: "length", label: "length", type: "number", helperText: "탐색 깊이" },
    { key: "candidates", label: "candidates", type: "text", helperText: "예: 1,2,3" },
    {
      key: "candidateGenerator",
      label: "candidateGenerator",
      type: "text",
      helperText: "사용 변수: partial, depth, candidates (빈 값이면 candidates 그대로 사용)",
      placeholder: "depth % 2 === 0 ? candidates : candidates.filter((v) => v % 2 === 0)",
    },
    {
      key: "validPredicate",
      label: "validPredicate",
      type: "text",
      helperText: "사용 변수: partial, depth, choice",
      placeholder: "!partial.includes(choice)",
    },
    {
      key: "goalPredicate",
      label: "goalPredicate",
      type: "text",
      helperText: "사용 변수: partial, depth, length",
      placeholder: "depth === length",
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
    length: "4",
    candidates: "1,2,3,4",
    candidateGenerator: "candidates",
    validPredicate: "!partial.includes(choice)",
    goalPredicate: "depth === length",
    stopAfterFirst: "true",
    detailMode: "summary",
    maxSteps: "200",
  }),
  serializeInput: (input) => JSON.stringify(input, null, 2),
  parseInputText: (text) => {
    try {
      const parsed = JSON.parse(text) as Partial<BacktrackingGenericInput>;
      const value: BacktrackingGenericInput = {
        length: String(parsed.length ?? ""),
        candidates: String(parsed.candidates ?? ""),
        candidateGenerator: String(parsed.candidateGenerator ?? "candidates"),
        validPredicate: String(parsed.validPredicate ?? ""),
        goalPredicate: String(parsed.goalPredicate ?? ""),
        stopAfterFirst: parsed.stopAfterFirst === "true" ? "true" : "false",
        detailMode: parsed.detailMode === "summary" ? "summary" : "detailed",
        maxSteps: String(parsed.maxSteps ?? "200"),
      };
      parseInput(value);
      return { ok: true, value };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "입력 파싱 실패" };
    }
  },
  run: (input) => {
    try {
      return runGeneric(input);
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
            id: "bt-generic-error",
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
