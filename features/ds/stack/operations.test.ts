import { expect, test } from "vitest";
import { createEmptyStackState, peek, pop, push } from "./operations";
import type { ListSnapshot } from "../../visualizer/types";

function expectPresent<T>(value: T | null | undefined): asserts value is T {
  expect(value).toBeTruthy();
}

function assertStackInvariant(state: ListSnapshot) {
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

test("push adds node on top", () => {
  const result = push(createEmptyStackState(), 10);

  expect(result.finalState.size).toBe(1);
  expectPresent(result.finalState.headId);
  const top = result.finalState.nodes[result.finalState.headId];
  expect(top.value).toBe(10);
  assertStackInvariant(result.finalState);
});

test("pop removes top", () => {
  const one = push(createEmptyStackState(), 1).finalState;
  const two = push(one, 2).finalState;
  const three = push(two, 3).finalState;

  const result = pop(three);

  expect(result.finalState.size).toBe(2);
  expectPresent(result.finalState.headId);
  expect(result.finalState.nodes[result.finalState.headId].value).toBe(2);
  assertStackInvariant(result.finalState);
});

test("peek returns top without mutation", () => {
  const one = push(createEmptyStackState(), 5).finalState;
  const two = push(one, 9).finalState;

  const result = peek(two);
  expect(result.finalState.size).toBe(2);
  expect(result.steps[0].title).toBe("Peek");
  expect(result.steps[0].description.includes("9")).toBeTruthy();
  assertStackInvariant(result.finalState);
});

test("pop on empty returns error step", () => {
  const result = pop(createEmptyStackState());
  expect(result.steps.length).toBe(1);
  expect(result.steps[0].isError).toBe(true);
  expect(result.finalState.size).toBe(0);
});
