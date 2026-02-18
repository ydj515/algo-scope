import assert from "node:assert/strict";
import test from "node:test";
import { createEmptyTreeState, insertValue, searchValue } from "./operations";
import type { ListSnapshot } from "../../visualizer/types";

function leftId(node: ListSnapshot["nodes"][number]): number | null {
  return node.prevId === node.id ? null : node.prevId;
}

function rightId(node: ListSnapshot["nodes"][number]): number | null {
  return node.nextId === node.id ? null : node.nextId;
}

function assertTreeInvariant(state: ListSnapshot) {
  assert.equal(state.size, Object.keys(state.nodes).length);

  if (state.size === 0) {
    assert.equal(state.headId, null);
    assert.deepEqual(state.order, []);
    return;
  }

  assert.ok(state.headId !== null);

  const visited = new Set<number>();
  const queue: number[] = [state.headId];

  while (queue.length > 0) {
    const id = queue.shift();
    assert.ok(id !== undefined);
    if (visited.has(id)) {
      continue;
    }

    const node: ListSnapshot["nodes"][number] | undefined = state.nodes[id];
    assert.ok(node);
    visited.add(id);

    const left = leftId(node);
    const right = rightId(node);

    if (left !== null) {
      assert.ok(state.nodes[left]);
      assert.ok(state.nodes[left].value < node.value);
      queue.push(left);
    }

    if (right !== null) {
      assert.ok(state.nodes[right]);
      assert.ok(state.nodes[right].value >= node.value);
      queue.push(right);
    }
  }

  assert.equal(visited.size, state.size);
}

test("insert builds BST relations", () => {
  let state = createEmptyTreeState();
  state = insertValue(state, 10).finalState;
  state = insertValue(state, 5).finalState;
  state = insertValue(state, 14).finalState;

  const rootId = state.headId;
  assert.ok(rootId !== null);

  const root = state.nodes[rootId];
  const left = leftId(root);
  const right = rightId(root);

  assert.ok(left !== null);
  assert.ok(right !== null);
  assert.equal(state.nodes[left].value, 5);
  assert.equal(state.nodes[right].value, 14);
  assertTreeInvariant(state);
});

test("search finds existing value", () => {
  let state = createEmptyTreeState();
  state = insertValue(state, 8).finalState;
  state = insertValue(state, 3).finalState;
  state = insertValue(state, 12).finalState;

  const result = searchValue(state, 12);
  assert.equal(result.steps[result.steps.length - 1].title, "검색 성공");
  assertTreeInvariant(result.finalState);
});

test("search returns failure on missing value", () => {
  let state = createEmptyTreeState();
  state = insertValue(state, 8).finalState;
  state = insertValue(state, 3).finalState;

  const result = searchValue(state, 99);
  assert.equal(result.steps[result.steps.length - 1].title, "검색 실패");
  assert.equal(result.steps[result.steps.length - 1].isError, true);
  assertTreeInvariant(result.finalState);
});

test("separate tree instances keep independent id sequences", () => {
  const a = insertValue(createEmptyTreeState(), 1).finalState;
  const b = insertValue(createEmptyTreeState(), 2).finalState;

  assert.equal(a.headId, 1);
  assert.equal(b.headId, 1);
});
