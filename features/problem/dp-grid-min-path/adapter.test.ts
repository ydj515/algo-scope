import { expect, test } from "vitest";
import { dpGridMinPathAdapter } from "./adapter";

test("grid min path adapter computes answer", () => {
  const result = dpGridMinPathAdapter.run({
    grid: "1 3 1\n1 5 1\n4 2 1",
    detailMode: "summary",
    showPath: "true",
  });

  expect(result.finalSnapshot.answer).toBe(7);
  expect(result.finalSnapshot.reconstructedPath.length > 0).toBeTruthy();
});

test("grid min path adapter handles invalid grid", () => {
  const result = dpGridMinPathAdapter.run({
    grid: "1 a\n2 3",
    detailMode: "summary",
    showPath: "false",
  });

  expect(result.steps[0].isError).toBe(true);
});
