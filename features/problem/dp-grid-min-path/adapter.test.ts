import assert from "node:assert/strict";
import test from "node:test";
import { dpGridMinPathAdapter } from "./adapter";

test("grid min path adapter computes answer", () => {
  const result = dpGridMinPathAdapter.run({
    grid: "1 3 1\n1 5 1\n4 2 1",
    detailMode: "summary",
    showPath: "true",
  });

  assert.equal(result.finalSnapshot.answer, 7);
  assert.ok(result.finalSnapshot.reconstructedPath.length > 0);
});

test("grid min path adapter handles invalid grid", () => {
  const result = dpGridMinPathAdapter.run({
    grid: "1 a\n2 3",
    detailMode: "summary",
    showPath: "false",
  });

  assert.equal(result.steps[0].isError, true);
});
