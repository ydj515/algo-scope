import { expect, test } from "vitest";
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

  expect(parsed.ok).toBe(true);
  if (parsed.ok) {
    expect(parsed.value.rows).toBe("3");
    expect(parsed.value.walls).toBe("1,1");
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

  expect(normalized).toBeTruthy();
  if (normalized) {
    expect(normalized.rows).toBe("3");
    expect(normalized.cols).toBe("3");
    expect(normalized.goalRow).toBe("2");
    expect(normalized.goalCol).toBe("2");
    expect(normalized.walls.includes("0,1")).toBeTruthy();
    expect(normalized.walls.includes("2,0")).toBeTruthy();
  }
});

test("run finds path on reachable grid", () => {
  const result = gridDfsAdapter.run(makeInput());
  const last = result.steps[result.steps.length - 1];

  expect(last.phase).toBe("exit");
  expect(last.isError).toBe(false);
  expect(result.finalSnapshot.path.length > 0).toBeTruthy();
  expect(result.finalSnapshot.path[0].row).toBe(0);
  expect(result.finalSnapshot.path[0].col).toBe(0);
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
  expect(last.phase).toBe("exit");
  expect(last.isError).toBe(true);
  expect(result.finalSnapshot.path.length).toBe(0);
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

  expect(result.finalSnapshot.rows).toBe(4);
  expect(result.finalSnapshot.cols).toBe(6);
  expect(result.finalSnapshot.goal.row).toBe(3);
  expect(result.finalSnapshot.goal.col).toBe(5);
  expect(result.finalSnapshot.walls.length > 0).toBeTruthy();
  expect(result.steps[result.steps.length - 1].phase).toBe("exit");
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

  expect(result.finalSnapshot.rows).toBe(5);
  expect(result.finalSnapshot.cols).toBe(5);
  expect(result.finalSnapshot.goal.row).toBe(4);
  expect(result.finalSnapshot.goal.col).toBe(4);
  expect(result.finalSnapshot.walls.length).toBe(0);
  expect(result.steps[result.steps.length - 1].phase).toBe("exit");
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

  expect(result.finalSnapshot.showCellValues).toBe(true);
  expect(result.finalSnapshot.matrixValues).toBeTruthy();
  expect(result.finalSnapshot.matrixValues?.[0][0]).toBe(1);
  expect(result.finalSnapshot.walls.length).toBe(1);
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

  expect(result.finalSnapshot.rows).toBe(5);
  expect(result.finalSnapshot.cols).toBe(5);
  expect(result.finalSnapshot.goal.row).toBe(4);
  expect(result.finalSnapshot.goal.col).toBe(4);
  expect(result.finalSnapshot.showCellValues).toBe(true);
  expect(result.steps[result.steps.length - 1].phase).toBe("exit");
});
