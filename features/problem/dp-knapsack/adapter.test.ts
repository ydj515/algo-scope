import { expect, test } from "vitest";
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

  expect(result.finalSnapshot.answer).toBe(12);
  expect(result.finalSnapshot.reconstructedPath.length > 0).toBeTruthy();
  expect(result.steps[result.steps.length - 1].phase).toBe("exit");
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

  expect(result.finalSnapshot.answer).toBe(12);
  expect(result.finalSnapshot.rows).toBe(1);
  expect(result.finalSnapshot.meta?.tableMode).toBe("1d");
  expect(result.finalSnapshot.reconstructedPath.length > 0).toBeTruthy();
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

  expect(result.steps[0].isError).toBe(true);
});
