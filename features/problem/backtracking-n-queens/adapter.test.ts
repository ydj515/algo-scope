import assert from "node:assert/strict";
import test from "node:test";
import { backtrackingNQueensAdapter } from "./adapter";

test("n-queens finds first solution with stopAfterFirst", () => {
  const result = backtrackingNQueensAdapter.run({
    n: "4",
    dedupeSymmetry: "false",
    stopAfterFirst: "true",
    detailMode: "summary",
    maxSteps: "500",
  });

  assert.equal(result.finalSnapshot.solutions.length, 1);
  assert.equal(result.finalSnapshot.stoppedBy, "first_solution");
  assert.equal(result.finalSnapshot.boardSize, 4);
});

test("n-queens can continue search when stopAfterFirst is false", () => {
  const result = backtrackingNQueensAdapter.run({
    n: "4",
    dedupeSymmetry: "false",
    stopAfterFirst: "false",
    detailMode: "summary",
    maxSteps: "2000",
  });

  assert.ok(result.finalSnapshot.solutions.length >= 2);
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

  assert.ok(withoutDedupe.finalSnapshot.solutions.length >= 2);
  assert.equal(withDedupe.finalSnapshot.solutions.length, 1);
});
