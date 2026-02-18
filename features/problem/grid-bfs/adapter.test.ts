import assert from "node:assert/strict";
import test from "node:test";
import { gridBfsAdapter, type GridBfsInput } from "./adapter";

function makeInput(overrides: Partial<GridBfsInput> = {}): GridBfsInput {
  return {
    rows: "4",
    cols: "4",
    startRow: "0",
    startCol: "0",
    goalRow: "3",
    goalCol: "3",
    walls: "1,1;1,2",
    map: "",
    ...overrides,
  };
}

test("parseInputText parses valid json", () => {
  const parsed = gridBfsAdapter.parseInputText(
    JSON.stringify({
      rows: 3,
      cols: 3,
      start: [0, 0],
      goal: [2, 2],
      walls: [[1, 1]],
    }),
  );

  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.equal(parsed.value.rows, "3");
    assert.equal(parsed.value.walls, "1,1");
  }
});

test("normalizeFormInput auto-fills rows/cols/walls/goal from map", () => {
  const normalized = gridBfsAdapter.normalizeFormInput?.(
    makeInput({
      rows: "",
      cols: "",
      goalRow: "",
      goalCol: "",
      walls: "",
      map: "101\n111\n001",
    }),
  );

  assert.ok(normalized);
  if (normalized) {
    assert.equal(normalized.rows, "3");
    assert.equal(normalized.cols, "3");
    assert.equal(normalized.goalRow, "2");
    assert.equal(normalized.goalCol, "2");
    assert.ok(normalized.walls.includes("0,1"));
    assert.ok(normalized.walls.includes("2,0"));
  }
});

test("run finds path on reachable grid", () => {
  const result = gridBfsAdapter.run(makeInput());
  const last = result.steps[result.steps.length - 1];

  assert.equal(last.phase, "exit");
  assert.equal(last.isError, false);
  assert.ok(result.finalSnapshot.path.length > 0);
  assert.equal(result.finalSnapshot.path[0].row, 0);
  assert.equal(result.finalSnapshot.path[0].col, 0);
});

test("run returns failure when goal unreachable", () => {
  const result = gridBfsAdapter.run(
    makeInput({
      rows: "3",
      cols: "3",
      goalRow: "2",
      goalCol: "2",
      walls: "0,1;1,0;1,1;1,2;2,1",
    }),
  );

  const last = result.steps[result.steps.length - 1];
  assert.equal(last.phase, "exit");
  assert.equal(last.isError, true);
  assert.equal(result.finalSnapshot.path.length, 0);
});

test("run infers rows/cols/walls from map text", () => {
  const result = gridBfsAdapter.run(
    makeInput({
      startRow: "0",
      startCol: "0",
      goalRow: "0",
      goalCol: "0",
      map: "101111\n101010\n101011\n111011",
      rows: "",
      cols: "",
      walls: "",
    }),
  );

  assert.equal(result.finalSnapshot.rows, 4);
  assert.equal(result.finalSnapshot.cols, 6);
  assert.equal(result.finalSnapshot.goal.row, 3);
  assert.equal(result.finalSnapshot.goal.col, 5);
  assert.ok(result.finalSnapshot.walls.length > 0);
  assert.equal(result.steps[result.steps.length - 1].phase, "exit");
});
