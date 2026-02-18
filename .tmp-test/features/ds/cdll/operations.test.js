"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const operations_1 = require("./operations");
function assertCircularInvariant(state) {
    const nodeIds = Object.keys(state.nodes).map(Number);
    strict_1.default.equal(state.size, nodeIds.length);
    if (state.size === 0) {
        strict_1.default.equal(state.headId, null);
        strict_1.default.equal(state.tailId, null);
        strict_1.default.deepEqual(state.order, []);
        return;
    }
    strict_1.default.notEqual(state.headId, null);
    strict_1.default.notEqual(state.tailId, null);
    const visited = new Set();
    let cursor = state.headId;
    for (let i = 0; i < state.size; i += 1) {
        strict_1.default.ok(!visited.has(cursor));
        visited.add(cursor);
        const node = state.nodes[cursor];
        strict_1.default.ok(node);
        const next = state.nodes[node.nextId];
        const prev = state.nodes[node.prevId];
        strict_1.default.ok(next);
        strict_1.default.ok(prev);
        strict_1.default.equal(next.prevId, node.id);
        strict_1.default.equal(prev.nextId, node.id);
        cursor = node.nextId;
    }
    strict_1.default.equal(visited.size, state.size);
}
(0, node_test_1.default)("insertHead on empty list creates self-loop head/tail", () => {
    const initial = (0, operations_1.createEmptyListState)();
    const result = (0, operations_1.insertHead)(initial, 10);
    strict_1.default.equal(result.finalState.size, 1);
    strict_1.default.notEqual(result.finalState.headId, null);
    strict_1.default.equal(result.finalState.headId, result.finalState.tailId);
    const onlyId = result.finalState.headId;
    const node = result.finalState.nodes[onlyId];
    strict_1.default.equal(node.nextId, onlyId);
    strict_1.default.equal(node.prevId, onlyId);
    assertCircularInvariant(result.finalState);
});
(0, node_test_1.default)("insertTail maintains circular invariant and tail movement", () => {
    const start = (0, operations_1.insertHead)((0, operations_1.createEmptyListState)(), 1).finalState;
    const result = (0, operations_1.insertTail)(start, 2);
    strict_1.default.equal(result.finalState.size, 2);
    assertCircularInvariant(result.finalState);
    const head = result.finalState.headId;
    const tail = result.finalState.tailId;
    strict_1.default.notEqual(head, tail);
    strict_1.default.equal(result.finalState.nodes[head].prevId, tail);
    strict_1.default.equal(result.finalState.nodes[tail].nextId, head);
});
(0, node_test_1.default)("removeHead updates head/tail correctly", () => {
    const one = (0, operations_1.insertHead)((0, operations_1.createEmptyListState)(), 1).finalState;
    const two = (0, operations_1.insertTail)(one, 2).finalState;
    const three = (0, operations_1.insertTail)(two, 3).finalState;
    const result = (0, operations_1.removeHead)(three);
    strict_1.default.equal(result.finalState.size, 2);
    assertCircularInvariant(result.finalState);
    const head = result.finalState.headId;
    const tail = result.finalState.tailId;
    strict_1.default.equal(result.finalState.nodes[head].prevId, tail);
    strict_1.default.equal(result.finalState.nodes[tail].nextId, head);
});
(0, node_test_1.default)("removeTail on single node makes list empty", () => {
    const one = (0, operations_1.insertHead)((0, operations_1.createEmptyListState)(), 7).finalState;
    const result = (0, operations_1.removeTail)(one);
    strict_1.default.equal(result.finalState.size, 0);
    strict_1.default.equal(result.finalState.headId, null);
    strict_1.default.equal(result.finalState.tailId, null);
    assertCircularInvariant(result.finalState);
});
(0, node_test_1.default)("removeHead on empty list returns error step", () => {
    const empty = (0, operations_1.createEmptyListState)();
    const result = (0, operations_1.removeHead)(empty);
    strict_1.default.equal(result.steps.length, 1);
    strict_1.default.equal(result.steps[0].isError, true);
    strict_1.default.equal(result.finalState.size, 0);
});
(0, node_test_1.default)("searchValue not found visits at most size nodes", () => {
    const one = (0, operations_1.insertHead)((0, operations_1.createEmptyListState)(), 11).finalState;
    const two = (0, operations_1.insertTail)(one, 22).finalState;
    const three = (0, operations_1.insertTail)(two, 33).finalState;
    const result = (0, operations_1.searchValue)(three, 999);
    const compareSteps = result.steps.filter((step) => step.title === "노드 비교");
    strict_1.default.equal(compareSteps.length, three.size);
    strict_1.default.equal(result.steps[result.steps.length - 1].title, "Not Found");
    assertCircularInvariant(result.finalState);
});
