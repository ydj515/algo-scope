import assert from "node:assert/strict";
import test from "node:test";
import { createEmptyStackState, peek, pop, push } from "./operations";
import type { ListSnapshot } from "../../visualizer/types";

function assertStackInvariant(state: ListSnapshot) {
  assert.equal(state.size, Object.keys(state.nodes).length);

  if (state.size === 0) {
    assert.equal(state.headId, null);
    assert.equal(state.tailId, null);
    assert.deepEqual(state.order, []);
    return;
  }

  assert.ok(state.headId !== null);
  assert.ok(state.tailId !== null);
  assert.equal(state.order.length, state.size);

  const visited = new Set<number>();
  let cursor: number | null = state.headId;

  for (let i = 0; i < state.size; i += 1) {
    assert.ok(cursor !== null);
    assert.ok(!visited.has(cursor));
    visited.add(cursor);

    const node: ListSnapshot["nodes"][number] | undefined = state.nodes[cursor];
    assert.ok(node);

    if (i === state.size - 1) {
      assert.equal(node.id, state.tailId);
    }

    cursor = node.nextId === node.id ? null : node.nextId;
  }
}

test("push adds node on top", () => {
  const result = push(createEmptyStackState(), 10);

  assert.equal(result.finalState.size, 1);
  assert.ok(result.finalState.headId !== null);
  const top = result.finalState.nodes[result.finalState.headId];
  assert.equal(top.value, 10);
  assertStackInvariant(result.finalState);
});

test("pop removes top", () => {
  const one = push(createEmptyStackState(), 1).finalState;
  const two = push(one, 2).finalState;
  const three = push(two, 3).finalState;

  const result = pop(three);

  assert.equal(result.finalState.size, 2);
  assert.ok(result.finalState.headId !== null);
  assert.equal(result.finalState.nodes[result.finalState.headId].value, 2);
  assertStackInvariant(result.finalState);
});

test("peek returns top without mutation", () => {
  const one = push(createEmptyStackState(), 5).finalState;
  const two = push(one, 9).finalState;

  const result = peek(two);
  assert.equal(result.finalState.size, 2);
  assert.equal(result.steps[0].title, "Peek");
  assert.ok(result.steps[0].description.includes("9"));
  assertStackInvariant(result.finalState);
});

test("pop on empty returns error step", () => {
  const result = pop(createEmptyStackState());
  assert.equal(result.steps.length, 1);
  assert.equal(result.steps[0].isError, true);
  assert.equal(result.finalState.size, 0);
});
