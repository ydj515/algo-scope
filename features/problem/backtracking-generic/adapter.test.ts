import assert from "node:assert/strict";
import test from "node:test";
import { backtrackingGenericAdapter } from "./adapter";

test("generic adapter stops at first solution when enabled", () => {
  const result = backtrackingGenericAdapter.run({
    length: "3",
    candidates: "1,2,3",
    candidateGenerator: "candidates",
    validPredicate: "!partial.includes(choice)",
    goalPredicate: "depth === length",
    stopAfterFirst: "true",
    detailMode: "summary",
    maxSteps: "300",
  });

  assert.equal(result.finalSnapshot.solutions.length, 1);
  assert.equal(result.finalSnapshot.stoppedBy, "first_solution");
});

test("generic adapter respects maxSteps", () => {
  const result = backtrackingGenericAdapter.run({
    length: "5",
    candidates: "1,2,3,4,5",
    candidateGenerator: "candidates",
    validPredicate: "true",
    goalPredicate: "depth === length",
    stopAfterFirst: "false",
    detailMode: "detailed",
    maxSteps: "10",
  });

  assert.equal(result.finalSnapshot.stoppedBy, "max_steps");
});

test("generic adapter supports depth-based candidateGenerator", () => {
  const result = backtrackingGenericAdapter.run({
    length: "2",
    candidates: "1,2,3,4",
    candidateGenerator: "depth === 0 ? [1,2] : [3]",
    validPredicate: "true",
    goalPredicate: "depth === length",
    stopAfterFirst: "false",
    detailMode: "summary",
    maxSteps: "300",
  });

  const serialized = result.finalSnapshot.solutions.map((solution) => solution.join(",")).sort();
  assert.deepEqual(serialized, ["1,3", "2,3"]);
});
