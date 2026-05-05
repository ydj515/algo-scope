import { expect, test } from "vitest";
import { createEmptyTreeState, insertValue, searchValue } from "./operations";
import type { ListSnapshot } from "../../visualizer/types";

function expectPresent<T>(value: T | null | undefined): asserts value is T {
  expect(value).toBeTruthy();
}

function leftId(node: ListSnapshot["nodes"][number]): number | null {
  return node.prevId === node.id ? null : node.prevId;
}

function rightId(node: ListSnapshot["nodes"][number]): number | null {
  return node.nextId === node.id ? null : node.nextId;
}

function assertTreeInvariant(state: ListSnapshot) {
  expect(state.size).toBe(Object.keys(state.nodes).length);

  if (state.size === 0) {
    expect(state.headId).toBe(null);
    expect(state.order).toEqual([]);
    return;
  }

  expectPresent(state.headId);

  const visited = new Set<number>();
  const queue: number[] = [state.headId];

  while (queue.length > 0) {
    const id = queue.shift();
    expectPresent(id);
    if (visited.has(id)) {
      continue;
    }

    const node: ListSnapshot["nodes"][number] | undefined = state.nodes[id];
    expectPresent(node);
    visited.add(id);

    const left = leftId(node);
    const right = rightId(node);

    if (left !== null) {
      expect(state.nodes[left]).toBeTruthy();
      expect(state.nodes[left].value < node.value).toBeTruthy();
      queue.push(left);
    }

    if (right !== null) {
      expect(state.nodes[right]).toBeTruthy();
      expect(state.nodes[right].value >= node.value).toBeTruthy();
      queue.push(right);
    }
  }

  expect(visited.size).toBe(state.size);
}

test("insert builds BST relations", () => {
  let state = createEmptyTreeState();
  state = insertValue(state, 10).finalState;
  state = insertValue(state, 5).finalState;
  state = insertValue(state, 14).finalState;

  const rootId = state.headId;
  expectPresent(rootId);

  const root = state.nodes[rootId];
  const left = leftId(root);
  const right = rightId(root);

  expectPresent(left);
  expectPresent(right);
  expect(state.nodes[left].value).toBe(5);
  expect(state.nodes[right].value).toBe(14);
  assertTreeInvariant(state);
});

test("search finds existing value", () => {
  let state = createEmptyTreeState();
  state = insertValue(state, 8).finalState;
  state = insertValue(state, 3).finalState;
  state = insertValue(state, 12).finalState;

  const result = searchValue(state, 12);
  expect(result.steps[result.steps.length - 1].title).toBe("검색 성공");
  assertTreeInvariant(result.finalState);
});

test("search returns failure on missing value", () => {
  let state = createEmptyTreeState();
  state = insertValue(state, 8).finalState;
  state = insertValue(state, 3).finalState;

  const result = searchValue(state, 99);
  expect(result.steps[result.steps.length - 1].title).toBe("검색 실패");
  expect(result.steps[result.steps.length - 1].isError).toBe(true);
  assertTreeInvariant(result.finalState);
});

test("separate tree instances keep independent id sequences", () => {
  const a = insertValue(createEmptyTreeState(), 1).finalState;
  const b = insertValue(createEmptyTreeState(), 2).finalState;

  expect(a.headId).toBe(1);
  expect(b.headId).toBe(1);
});
