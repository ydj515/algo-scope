import assert from "node:assert/strict";
import test from "node:test";
import { gridDfsAdapter, type GridDfsInput } from "./adapter";

function makeInput(overrides: Partial<GridDfsInput> = {}): GridDfsInput {
  return {
    rows: "4",
    cols: "4",
    startRow: "0",
    startCol: "0",
    goalRow: "3",
    goalCol: "3",
    walls: "1,1;1,2",
    map: "",
    mapMode: "binary",
    blockedValues: "0",
    showCellValues: "false",
    ...overrides,
  };
}

test("parseInputText parses valid json", () => {
  const parsed = gridDfsAdapter.parseInputText(
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
  const normalized = gridDfsAdapter.normalizeFormInput?.(
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
  const result = gridDfsAdapter.run(makeInput());
  const last = result.steps[result.steps.length - 1];

  assert.equal(last.phase, "exit");
  assert.equal(last.isError, false);
  assert.ok(result.finalSnapshot.path.length > 0);
  assert.equal(result.finalSnapshot.path[0].row, 0);
  assert.equal(result.finalSnapshot.path[0].col, 0);
});

test("run returns failure when goal unreachable", () => {
  const result = gridDfsAdapter.run(
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
  const result = gridDfsAdapter.run(
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

test("run supports matrix mode map", () => {
  const result = gridDfsAdapter.run(
    makeInput({
      mapMode: "matrix",
      blockedValues: "0",
      map: "6 8 2 6 2\n3 2 3 4 6\n6 7 3 3 2\n7 2 5 3 6\n8 9 5 2 7",
      rows: "",
      cols: "",
      walls: "",
    }),
  );

  assert.equal(result.finalSnapshot.rows, 5);
  assert.equal(result.finalSnapshot.cols, 5);
  assert.equal(result.finalSnapshot.goal.row, 4);
  assert.equal(result.finalSnapshot.goal.col, 4);
  assert.equal(result.finalSnapshot.walls.length, 0);
  assert.equal(result.steps[result.steps.length - 1].phase, "exit");
});

test("run supports blockedValues expression and matrix number overlay", () => {
  const result = gridDfsAdapter.run(
    makeInput({
      mapMode: "matrix",
      blockedValues: "==5",
      showCellValues: "true",
      map: "1 2 3\n4 5 6\n7 8 9",
      rows: "",
      cols: "",
      walls: "",
    }),
  );

  assert.equal(result.finalSnapshot.showCellValues, true);
  assert.ok(result.finalSnapshot.matrixValues);
  assert.equal(result.finalSnapshot.matrixValues?.[0][0], 1);
  assert.equal(result.finalSnapshot.walls.length, 1);
});

test("matrix >5 rule keeps start/goal traversable", () => {
  const result = gridDfsAdapter.run(
    makeInput({
      mapMode: "matrix",
      blockedValues: ">5",
      showCellValues: "true",
      map: "6 8 2 6 2\n3 2 3 4 6\n6 7 3 3 2\n7 2 5 3 6\n8 9 5 2 7",
      rows: "",
      cols: "",
      walls: "",
    }),
  );

  assert.equal(result.finalSnapshot.rows, 5);
  assert.equal(result.finalSnapshot.cols, 5);
  assert.equal(result.finalSnapshot.goal.row, 4);
  assert.equal(result.finalSnapshot.goal.col, 4);
  assert.equal(result.finalSnapshot.showCellValues, true);
  assert.equal(result.steps[result.steps.length - 1].phase, "exit");
});
