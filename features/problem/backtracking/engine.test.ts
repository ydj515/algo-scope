import { expect, test } from "vitest";
import { runBacktrackingEngine } from "./engine";

test("summary 모드는 핵심 step만 남기고 해를 기록한다", () => {
  const result = runBacktrackingEngine(
    {
      length: 1,
      candidates: [1],
      isValid: () => true,
    },
    {
      stopAfterFirst: false,
      detailMode: "summary",
      maxSteps: 20,
    },
  );

  expect(result.steps.map((step) => step.title)).toEqual([
    "재귀 진입",
    "재귀 진입",
    "해 발견",
    "탐색 종료",
  ]);
  expect(result.finalSnapshot.solutions).toEqual([[1]]);
  expect(result.finalSnapshot.stoppedBy).toBe("none");
});

test("detailed 모드는 가지치기와 되돌리기를 포함해 탐색 메타를 누적한다", () => {
  const result = runBacktrackingEngine(
    {
      length: 2,
      candidates: [1, 2],
      isValid: (partial, _depth, choice) => !partial.includes(choice),
    },
    {
      stopAfterFirst: false,
      detailMode: "detailed",
      maxSteps: 50,
    },
  );

  const titles = result.steps.map((step) => step.title);

  expect(titles).toContain("선택");
  expect(titles).toContain("가지치기");
  expect(titles).toContain("되돌리기");
  expect(result.finalSnapshot.solutions).toEqual([
    [1, 2],
    [2, 1],
  ]);
  expect(result.finalSnapshot.pruned).toBe(2);
  expect(result.finalSnapshot.visitedNodes).toBe(5);
});

test("snapshotEnhancer는 중간 step과 최종 snapshot 모두에 적용된다", () => {
  const result = runBacktrackingEngine(
    {
      length: 1,
      candidates: [7],
      isValid: () => true,
      snapshotEnhancer: (snapshot) => ({
        ...snapshot,
        boardSize: 4,
        queenCols: [...snapshot.partial],
      }),
    },
    {
      stopAfterFirst: false,
      detailMode: "summary",
      maxSteps: 20,
    },
  );

  expect(result.steps.every((step) => step.snapshot.boardSize === 4)).toBe(true);
  expect(result.steps.at(-1)?.snapshot.queenCols).toEqual([]);
  expect(result.finalSnapshot.boardSize).toBe(4);
  expect(result.finalSnapshot.queenCols).toEqual([]);
});

test("maxSteps 도달 시 탐색을 중단하고 중단 사유를 남긴다", () => {
  const result = runBacktrackingEngine(
    {
      length: 3,
      candidates: [1, 2, 3],
      isValid: () => true,
    },
    {
      stopAfterFirst: false,
      detailMode: "detailed",
      maxSteps: 2,
    },
  );

  expect(result.finalSnapshot.stoppedBy).toBe("max_steps");
  expect(result.finalSnapshot.message).toContain("maxSteps(2)");
  expect(result.steps).toHaveLength(2);
  expect(result.steps.at(-1)?.title).not.toBe("탐색 종료");
});

test("candidateGenerator가 숫자 배열이 아니면 예외를 던진다", () => {
  expect(() =>
    runBacktrackingEngine(
      {
        length: 1,
        candidates: [1, 2],
        candidateGenerator: () => [1, Number.NaN],
        isValid: () => true,
      },
      {
        stopAfterFirst: false,
        detailMode: "summary",
        maxSteps: 20,
      },
    ),
  ).toThrowError("candidateGenerator는 숫자 배열을 반환해야 합니다.");
});
