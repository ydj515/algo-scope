import assert from "node:assert/strict";
import test from "node:test";
import { createEmptyQueueState, dequeue, enqueue, peek } from "./operations";
import type { ListSnapshot } from "../../visualizer/types";

function assertQueueInvariant(state: ListSnapshot) {
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

test("enqueue adds node at rear", () => {
  const result = enqueue(createEmptyQueueState(), 10);

  assert.equal(result.finalState.size, 1);
  assert.ok(result.finalState.headId !== null);
  assert.ok(result.finalState.tailId !== null);
  const front = result.finalState.nodes[result.finalState.headId];
  const rear = result.finalState.nodes[result.finalState.tailId];
  assert.equal(front.value, 10);
  assert.equal(rear.value, 10);
  assertQueueInvariant(result.finalState);
});

test("dequeue removes front in FIFO order", () => {
  const one = enqueue(createEmptyQueueState(), 1).finalState;
  const two = enqueue(one, 2).finalState;
  const three = enqueue(two, 3).finalState;

  const result = dequeue(three);

  assert.equal(result.finalState.size, 2);
  assert.ok(result.finalState.headId !== null);
  assert.equal(result.finalState.nodes[result.finalState.headId].value, 2);
  assertQueueInvariant(result.finalState);
});

test("peek returns front without mutation", () => {
  const one = enqueue(createEmptyQueueState(), 5).finalState;
  const two = enqueue(one, 9).finalState;

  const result = peek(two);
  assert.equal(result.finalState.size, 2);
  assert.equal(result.steps[0].title, "Peek");
  assert.ok(result.steps[0].description.includes("5"));
  assertQueueInvariant(result.finalState);
});

test("dequeue on empty returns error step", () => {
  const result = dequeue(createEmptyQueueState());
  assert.equal(result.steps.length, 1);
  assert.equal(result.steps[0].isError, true);
  assert.equal(result.finalState.size, 0);
});
