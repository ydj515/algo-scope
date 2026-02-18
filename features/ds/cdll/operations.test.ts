import assert from "node:assert/strict";
import test from "node:test";
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

function assertCircularInvariant(state: ListSnapshot) {
  const nodeIds = Object.keys(state.nodes).map(Number);

  assert.equal(state.size, nodeIds.length);

  if (state.size === 0) {
    assert.equal(state.headId, null);
    assert.equal(state.tailId, null);
    assert.deepEqual(state.order, []);
    return;
  }

  assert.ok(state.headId !== null);
  assert.ok(state.tailId !== null);

  const visited = new Set<number>();
  let cursor = state.headId;

  for (let i = 0; i < state.size; i += 1) {
    assert.ok(!visited.has(cursor));
    visited.add(cursor);

    const node = state.nodes[cursor];
    assert.ok(node);

    const next = state.nodes[node.nextId];
    const prev = state.nodes[node.prevId];
    assert.ok(next);
    assert.ok(prev);

    assert.equal(next.prevId, node.id);
    assert.equal(prev.nextId, node.id);

    cursor = node.nextId;
  }

  assert.equal(visited.size, state.size);
}

test("insertHead on empty list creates self-loop head/tail", () => {
  const initial = createEmptyListState();
  const result = insertHead(initial, 10);

  assert.equal(result.finalState.size, 1);
  assert.ok(result.finalState.headId !== null);
  assert.equal(result.finalState.headId, result.finalState.tailId);

  const onlyId = result.finalState.headId;
  const node = result.finalState.nodes[onlyId];
  assert.equal(node.nextId, onlyId);
  assert.equal(node.prevId, onlyId);
  assertCircularInvariant(result.finalState);
});

test("insertTail maintains circular invariant and tail movement", () => {
  const start = insertHead(createEmptyListState(), 1).finalState;
  const result = insertTail(start, 2);

  assert.equal(result.finalState.size, 2);
  assertCircularInvariant(result.finalState);

  assert.ok(result.finalState.headId !== null);
  assert.ok(result.finalState.tailId !== null);
  const head = result.finalState.headId;
  const tail = result.finalState.tailId;
  assert.notEqual(head, tail);

  assert.equal(result.finalState.nodes[head].prevId, tail);
  assert.equal(result.finalState.nodes[tail].nextId, head);
});

test("removeHead updates head/tail correctly", () => {
  const one = insertHead(createEmptyListState(), 1).finalState;
  const two = insertTail(one, 2).finalState;
  const three = insertTail(two, 3).finalState;

  const result = removeHead(three);
  assert.equal(result.finalState.size, 2);
  assertCircularInvariant(result.finalState);

  assert.ok(result.finalState.headId !== null);
  assert.ok(result.finalState.tailId !== null);
  const head = result.finalState.headId;
  const tail = result.finalState.tailId;
  assert.equal(result.finalState.nodes[head].prevId, tail);
  assert.equal(result.finalState.nodes[tail].nextId, head);
});

test("removeTail on single node makes list empty", () => {
  const one = insertHead(createEmptyListState(), 7).finalState;
  const result = removeTail(one);

  assert.equal(result.finalState.size, 0);
  assert.equal(result.finalState.headId, null);
  assert.equal(result.finalState.tailId, null);
  assertCircularInvariant(result.finalState);
});

test("removeHead on empty list returns error step", () => {
  const empty = createEmptyListState();
  const result = removeHead(empty);

  assert.equal(result.steps.length, 1);
  assert.equal(result.steps[0].isError, true);
  assert.equal(result.finalState.size, 0);
});

test("searchValue not found visits at most size nodes", () => {
  const one = insertHead(createEmptyListState(), 11).finalState;
  const two = insertTail(one, 22).finalState;
  const three = insertTail(two, 33).finalState;

  const result = searchValue(three, 999);
  const compareSteps = result.steps.filter((step: Step) => step.title === "노드 비교");

  assert.equal(compareSteps.length, three.size);
  assert.equal(result.steps[result.steps.length - 1].title, "Not Found");
  assertCircularInvariant(result.finalState);
});

test("separate list instances keep independent id sequences", () => {
  const listA = insertHead(createEmptyListState(), 1).finalState;
  const listB = insertHead(createEmptyListState(), 9).finalState;

  assert.equal(listA.headId, 1);
  assert.equal(listB.headId, 1);
  assert.equal(listA.nextId, 2);
  assert.equal(listB.nextId, 2);
});
