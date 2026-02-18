import assert from "node:assert/strict";
import test from "node:test";
import { dpRecurrenceAdapter } from "./adapter";

test("recurrence adapter runs with custom boundary conditions", () => {
  const result = dpRecurrenceAdapter.run({
    rows: "3",
    cols: "3",
    baseValue: "0",
    firstRowInit: "left + 2",
    firstColInit: "up + 3",
    recurrence: "min(up, left) + 1",
    detailMode: "summary",
    showPath: "true",
  });

  const last = result.steps[result.steps.length - 1];
  assert.equal(last.phase, "exit");
  assert.equal(result.finalSnapshot.answer, 5);
  assert.ok(result.finalSnapshot.reconstructedPath.length > 0);
});

test("recurrence adapter parseInputText validates expression", () => {
  const parsed = dpRecurrenceAdapter.parseInputText(
    JSON.stringify({
      rows: 2,
      cols: 2,
      baseValue: 0,
      firstRowInit: "left + 1",
      firstColInit: "up + 1",
      recurrence: "min(up,left)+1",
      detailMode: "detailed",
      showPath: "false",
    }),
  );

  assert.equal(parsed.ok, true);
});
