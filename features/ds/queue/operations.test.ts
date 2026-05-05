import { expect, test } from "vitest";
import { createEmptyQueueState, dequeue, enqueue, peek } from "./operations";
import type { ListSnapshot } from "../../visualizer/types";

function expectPresent<T>(value: T | null | undefined): asserts value is T {
  expect(value).toBeTruthy();
}

function assertQueueInvariant(state: ListSnapshot) {
  expect(state.size).toBe(Object.keys(state.nodes).length);

  if (state.size === 0) {
    expect(state.headId).toBe(null);
    expect(state.tailId).toBe(null);
    expect(state.order).toEqual([]);
    return;
  }

  expect(state.headId !== null).toBeTruthy();
  expect(state.tailId !== null).toBeTruthy();
  expect(state.order.length).toBe(state.size);

  const visited = new Set<number>();
  let cursor: number | null = state.headId;

  for (let i = 0; i < state.size; i += 1) {
    expectPresent(cursor);
    expect(!visited.has(cursor)).toBeTruthy();
    visited.add(cursor);

    const node: ListSnapshot["nodes"][number] | undefined = state.nodes[cursor];
    expectPresent(node);

    if (i === state.size - 1) {
      expect(node.id).toBe(state.tailId);
    }

    cursor = node.nextId === node.id ? null : node.nextId;
  }
}

test("enqueue adds node at rear", () => {
  const result = enqueue(createEmptyQueueState(), 10);

  expect(result.finalState.size).toBe(1);
  expectPresent(result.finalState.headId);
  expectPresent(result.finalState.tailId);
  const front = result.finalState.nodes[result.finalState.headId];
  const rear = result.finalState.nodes[result.finalState.tailId];
  expect(front.value).toBe(10);
  expect(rear.value).toBe(10);
  assertQueueInvariant(result.finalState);
});

test("dequeue removes front in FIFO order", () => {
  const one = enqueue(createEmptyQueueState(), 1).finalState;
  const two = enqueue(one, 2).finalState;
  const three = enqueue(two, 3).finalState;

  const result = dequeue(three);

  expect(result.finalState.size).toBe(2);
  expectPresent(result.finalState.headId);
  expect(result.finalState.nodes[result.finalState.headId].value).toBe(2);
  assertQueueInvariant(result.finalState);
});

test("peek returns front without mutation", () => {
  const one = enqueue(createEmptyQueueState(), 5).finalState;
  const two = enqueue(one, 9).finalState;

  const result = peek(two);
  expect(result.finalState.size).toBe(2);
  expect(result.steps[0].title).toBe("Peek");
  expect(result.steps[0].description.includes("5")).toBeTruthy();
  assertQueueInvariant(result.finalState);
});

test("dequeue on empty returns error step", () => {
  const result = dequeue(createEmptyQueueState());
  expect(result.steps.length).toBe(1);
  expect(result.steps[0].isError).toBe(true);
  expect(result.finalState.size).toBe(0);
});
