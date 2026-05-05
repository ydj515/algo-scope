import { expect, test } from "vitest";
import { backtrackingNQueensAdapter } from "./adapter";

test("n-queens finds first solution with stopAfterFirst", () => {
  const result = backtrackingNQueensAdapter.run({
    n: "4",
    dedupeSymmetry: "false",
    stopAfterFirst: "true",
    detailMode: "summary",
    maxSteps: "500",
  });

  expect(result.finalSnapshot.solutions.length).toBe(1);
  expect(result.finalSnapshot.stoppedBy).toBe("first_solution");
  expect(result.finalSnapshot.boardSize).toBe(4);
});

test("n-queens can continue search when stopAfterFirst is false", () => {
  const result = backtrackingNQueensAdapter.run({
    n: "4",
    dedupeSymmetry: "false",
    stopAfterFirst: "false",
    detailMode: "summary",
    maxSteps: "2000",
  });

  expect(result.finalSnapshot.solutions.length >= 2).toBeTruthy();
});

test("n-queens dedupeSymmetry removes symmetric duplicate solutions", () => {
  const withoutDedupe = backtrackingNQueensAdapter.run({
    n: "4",
    dedupeSymmetry: "false",
    stopAfterFirst: "false",
    detailMode: "summary",
    maxSteps: "2000",
  });
  const withDedupe = backtrackingNQueensAdapter.run({
    n: "4",
    dedupeSymmetry: "true",
    stopAfterFirst: "false",
    detailMode: "summary",
    maxSteps: "2000",
  });

  expect(withoutDedupe.finalSnapshot.solutions.length >= 2).toBeTruthy();
  expect(withDedupe.finalSnapshot.solutions.length).toBe(1);
});
