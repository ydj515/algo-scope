import type { TraceStep } from "@/features/trace/types";
import type { BacktrackingRuntimeOptions, BacktrackingSnapshot } from "@/features/problem/backtracking/types";

/**
 * 공통 백트래킹 엔진이 문제별 규칙을 주입받기 위해 사용하는 설정입니다.
 * 후보 생성, 유효성 검사, 목표 판정, snapshot 후처리를 외부에서 주입할 수 있습니다.
 */
export type BacktrackingEngineConfig = {
  length: number;
  candidates: number[];
  candidateGenerator?: (
    partial: number[],
    depth: number,
    defaultCandidates: number[],
  ) => number[];
  isValid: (partial: number[], depth: number, choice: number) => boolean;
  isGoal?: (partial: number[], depth: number) => boolean;
  snapshotEnhancer?: (snapshot: BacktrackingSnapshot) => BacktrackingSnapshot;
};

/**
 * 백트래킹 실행 결과로 생성된 step 목록과 최종 snapshot을 묶은 반환 타입입니다.
 */
export type BacktrackingRunResult = {
  steps: Array<TraceStep<BacktrackingSnapshot>>;
  finalSnapshot: BacktrackingSnapshot;
};

const COMPLEXITY = { timeWorst: "O(b^d)", spaceWorst: "O(d)" };

function resolveCandidates(
  config: BacktrackingEngineConfig,
  partial: number[],
  depth: number,
): number[] {
  const generated = config.candidateGenerator
    ? config.candidateGenerator([...partial], depth, [...config.candidates])
    : config.candidates;

  if (!Array.isArray(generated) || generated.some((value) => !Number.isFinite(value))) {
    throw new Error("candidateGenerator는 숫자 배열을 반환해야 합니다.");
  }

  return [...generated];
}

function makeStep(
  id: string,
  title: string,
  description: string,
  phase: TraceStep<BacktrackingSnapshot>["phase"],
  snapshot: BacktrackingSnapshot,
): TraceStep<BacktrackingSnapshot> {
  return {
    id,
    title,
    description,
    phase,
    snapshot,
    complexity: COMPLEXITY,
  };
}

/**
 * 문제별 설정과 런타임 옵션을 받아 백트래킹 탐색을 수행하고 시각화용 trace를 생성합니다.
 * 상세 모드, 최대 step 수, 첫 해 발견 후 중단 같은 제어 흐름을 공통 엔진에서 일관되게 처리합니다.
 */
export function runBacktrackingEngine(
  config: BacktrackingEngineConfig,
  options: BacktrackingRuntimeOptions,
): BacktrackingRunResult {
  const solutions: number[][] = [];
  const partial: number[] = [];

  const runtime = {
    steps: [] as Array<TraceStep<BacktrackingSnapshot>>,
    stepsEmitted: 0,
    visitedNodes: 0,
    pruned: 0,
    halted: false,
    stoppedBy: "none" as BacktrackingSnapshot["stoppedBy"],
    sid: 1,
  };

  const emit = (
    title: string,
    description: string,
    phase: TraceStep<BacktrackingSnapshot>["phase"],
    depth: number,
    currentChoice: number | null,
    candidates: number[],
    message?: string,
  ) => {
    if (runtime.halted) {
      return;
    }

    if (runtime.stepsEmitted >= options.maxSteps) {
      runtime.halted = true;
      runtime.stoppedBy = "max_steps";
      return;
    }

    const baseSnapshot: BacktrackingSnapshot = {
      depth,
      partial: [...partial],
      currentChoice,
      candidates: [...candidates],
      detailMode: options.detailMode,
      solutions: solutions.map((solution) => [...solution]),
      stepsEmitted: runtime.stepsEmitted,
      visitedNodes: runtime.visitedNodes,
      pruned: runtime.pruned,
      stoppedBy: runtime.stoppedBy,
      message,
    };

    const snapshot = config.snapshotEnhancer
      ? config.snapshotEnhancer(baseSnapshot)
      : baseSnapshot;

    runtime.steps.push(
      makeStep(`bt-${runtime.sid}`, title, description, phase, snapshot),
    );
    runtime.sid += 1;
    runtime.stepsEmitted += 1;
  };

  const shouldEmit = (kind: "choose" | "prune" | "solution" | "backtrack" | "enter") => {
    if (options.detailMode === "detailed") {
      return true;
    }
    return kind === "solution" || kind === "enter";
  };

  const dfs = (depth: number) => {
    if (runtime.halted) {
      return;
    }

    runtime.visitedNodes += 1;
    const depthCandidates = resolveCandidates(config, partial, depth);

    if (shouldEmit("enter")) {
      emit("재귀 진입", `depth=${depth} 진입`, "enter", depth, null, depthCandidates);
    }

    const goalReached = config.isGoal
      ? config.isGoal(partial, depth)
      : depth === config.length;

    if (goalReached) {
      solutions.push([...partial]);
      emit("해 발견", `해 ${solutions.length}개째를 발견했습니다.`, "exit", depth, null, []);

      if (options.stopAfterFirst) {
        runtime.halted = true;
        runtime.stoppedBy = "first_solution";
      }
      return;
    }

    if (depth >= config.length) {
      return;
    }

    for (const choice of depthCandidates) {
      if (runtime.halted) {
        return;
      }

      if (shouldEmit("choose")) {
        emit("선택", `${depth}단계에서 ${choice} 선택 시도`, "enter", depth, choice, depthCandidates);
      }

      const valid = config.isValid(partial, depth, choice);
      if (!valid) {
        runtime.pruned += 1;
        if (shouldEmit("prune")) {
          emit("가지치기", `${choice}는 제약 위반으로 제외`, "prune", depth, choice, depthCandidates);
        }
        continue;
      }

      partial.push(choice);
      dfs(depth + 1);
      partial.pop();

      if (shouldEmit("backtrack")) {
        emit("되돌리기", `${choice} 선택을 되돌립니다.`, "update", depth, choice, depthCandidates);
      }
    }
  };

  dfs(0);

  const finalSnapshotBase: BacktrackingSnapshot = {
    depth: partial.length,
    partial: [...partial],
    currentChoice: null,
    candidates: resolveCandidates(config, partial, partial.length),
    detailMode: options.detailMode,
    solutions: solutions.map((solution) => [...solution]),
    stepsEmitted: runtime.stepsEmitted,
    visitedNodes: runtime.visitedNodes,
    pruned: runtime.pruned,
    stoppedBy: runtime.stoppedBy,
    message:
      runtime.stoppedBy === "first_solution"
        ? "첫 해를 찾은 뒤 종료했습니다."
        : runtime.stoppedBy === "max_steps"
          ? `maxSteps(${options.maxSteps})에 도달하여 종료했습니다.`
          : "탐색을 완료했습니다.",
  };

  const finalSnapshot = config.snapshotEnhancer
    ? config.snapshotEnhancer(finalSnapshotBase)
    : finalSnapshotBase;

  if (!runtime.halted || runtime.stoppedBy !== "max_steps") {
    runtime.steps.push(
      makeStep(
        `bt-${runtime.sid}`,
        "탐색 종료",
        finalSnapshot.message ?? "탐색 종료",
        "exit",
        finalSnapshot,
      ),
    );
  }

  return {
    steps: runtime.steps,
    finalSnapshot,
  };
}
