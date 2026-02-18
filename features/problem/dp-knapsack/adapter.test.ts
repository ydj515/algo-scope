import assert from "node:assert/strict";
import test from "node:test";
import { dpKnapsackAdapter } from "./adapter";

test("knapsack adapter computes optimal value in 2d mode", () => {
  const result = dpKnapsackAdapter.run({
    weights: "2,3,4,5",
    values: "3,4,5,8",
    capacity: "8",
    tableMode: "2d",
    detailMode: "summary",
    showPath: "true",
  });

  assert.equal(result.finalSnapshot.answer, 12);
  assert.ok(result.finalSnapshot.reconstructedPath.length > 0);
  assert.equal(result.steps[result.steps.length - 1].phase, "exit");
});

test("knapsack adapter computes optimal value in 1d mode", () => {
  const result = dpKnapsackAdapter.run({
    weights: "2,3,4,5",
    values: "3,4,5,8",
    capacity: "8",
    tableMode: "1d",
    detailMode: "summary",
    showPath: "true",
  });

  assert.equal(result.finalSnapshot.answer, 12);
  assert.equal(result.finalSnapshot.rows, 1);
  assert.equal(result.finalSnapshot.meta?.tableMode, "1d");
  assert.ok(result.finalSnapshot.reconstructedPath.length > 0);
});

test("knapsack adapter rejects mismatched lengths", () => {
  const result = dpKnapsackAdapter.run({
    weights: "2,3",
    values: "5",
    capacity: "4",
    tableMode: "2d",
    detailMode: "summary",
    showPath: "false",
  });

  assert.equal(result.steps[0].isError, true);
});
