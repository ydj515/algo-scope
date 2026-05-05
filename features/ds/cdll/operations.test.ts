import { expect, test } from "vitest";
import {
  createEmptyListState,
  insertHead,
  insertTail,
  removeHead,
  removeTail,
  searchValue,
} from "./operations";
import type { Step } from "../../visualizer/types";
import type { ListSnapshot } from "../../visualizer/types";

function expectPresent<T>(value: T | null | undefined): asserts value is T {
  expect(value).toBeTruthy();
}

function assertCircularInvariant(state: ListSnapshot) {
  const nodeIds = Object.keys(state.nodes).map(Number);

  expect(state.size).toBe(nodeIds.length);

  if (state.size === 0) {
    expect(state.headId).toBe(null);
    expect(state.tailId).toBe(null);
    expect(state.order).toEqual([]);
    return;
  }

  expect(state.headId !== null).toBeTruthy();
  expect(state.tailId !== null).toBeTruthy();

  const visited = new Set<number>();
  let cursor = state.headId;

  for (let i = 0; i < state.size; i += 1) {
    expectPresent(cursor);
    expect(!visited.has(cursor)).toBeTruthy();
    visited.add(cursor);

    const node = state.nodes[cursor];
    expectPresent(node);

    const next = state.nodes[node.nextId];
    const prev = state.nodes[node.prevId];
    expectPresent(next);
    expectPresent(prev);

    expect(next.prevId).toBe(node.id);
    expect(prev.nextId).toBe(node.id);

    cursor = node.nextId;
  }

  expect(visited.size).toBe(state.size);
}

test("insertHead on empty list creates self-loop head/tail", () => {
  const initial = createEmptyListState();
  const result = insertHead(initial, 10);

  expect(result.finalState.size).toBe(1);
  expectPresent(result.finalState.headId);
  expect(result.finalState.headId).toBe(result.finalState.tailId);

  const onlyId = result.finalState.headId;
  const node = result.finalState.nodes[onlyId];
  expect(node.nextId).toBe(onlyId);
  expect(node.prevId).toBe(onlyId);
  assertCircularInvariant(result.finalState);
});

test("insertTail maintains circular invariant and tail movement", () => {
  const start = insertHead(createEmptyListState(), 1).finalState;
  const result = insertTail(start, 2);

  expect(result.finalState.size).toBe(2);
  assertCircularInvariant(result.finalState);

  expectPresent(result.finalState.headId);
  expectPresent(result.finalState.tailId);
  const head = result.finalState.headId;
  const tail = result.finalState.tailId;
  expect(head).not.toBe(tail);

  expect(result.finalState.nodes[head].prevId).toBe(tail);
  expect(result.finalState.nodes[tail].nextId).toBe(head);
});

test("removeHead updates head/tail correctly", () => {
  const one = insertHead(createEmptyListState(), 1).finalState;
  const two = insertTail(one, 2).finalState;
  const three = insertTail(two, 3).finalState;

  const result = removeHead(three);
  expect(result.finalState.size).toBe(2);
  assertCircularInvariant(result.finalState);

  expectPresent(result.finalState.headId);
  expectPresent(result.finalState.tailId);
  const head = result.finalState.headId;
  const tail = result.finalState.tailId;
  expect(result.finalState.nodes[head].prevId).toBe(tail);
  expect(result.finalState.nodes[tail].nextId).toBe(head);
});

test("removeTail on single node makes list empty", () => {
  const one = insertHead(createEmptyListState(), 7).finalState;
  const result = removeTail(one);

  expect(result.finalState.size).toBe(0);
  expect(result.finalState.headId).toBe(null);
  expect(result.finalState.tailId).toBe(null);
  assertCircularInvariant(result.finalState);
});

test("removeHead on empty list returns error step", () => {
  const empty = createEmptyListState();
  const result = removeHead(empty);

  expect(result.steps.length).toBe(1);
  expect(result.steps[0].isError).toBe(true);
  expect(result.finalState.size).toBe(0);
});

test("searchValue not found visits at most size nodes", () => {
  const one = insertHead(createEmptyListState(), 11).finalState;
  const two = insertTail(one, 22).finalState;
  const three = insertTail(two, 33).finalState;

  const result = searchValue(three, 999);
  const compareSteps = result.steps.filter((step: Step) => step.title === "노드 비교");

  expect(compareSteps.length).toBe(three.size);
  expect(result.steps[result.steps.length - 1].title).toBe("Not Found");
  assertCircularInvariant(result.finalState);
});

test("separate list instances keep independent id sequences", () => {
  const listA = insertHead(createEmptyListState(), 1).finalState;
  const listB = insertHead(createEmptyListState(), 9).finalState;

  expect(listA.headId).toBe(1);
  expect(listB.headId).toBe(1);
  expect(listA.nextId).toBe(2);
  expect(listB.nextId).toBe(2);
});
