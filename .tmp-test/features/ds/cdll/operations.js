"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyListState = createEmptyListState;
exports.randomInit = randomInit;
exports.insertHead = insertHead;
exports.insertTail = insertTail;
exports.removeHead = removeHead;
exports.removeTail = removeTail;
exports.searchValue = searchValue;
const COMPLEXITY = {
    insert: { timeWorst: "O(1)", spaceWorst: "O(1)" },
    remove: { timeWorst: "O(1)", spaceWorst: "O(1)" },
    search: { timeWorst: "O(n)", spaceWorst: "O(1)" },
};
let nodeIdCounter = 1;
function nextNodeId() {
    const id = nodeIdCounter;
    nodeIdCounter += 1;
    return id;
}
function cloneState(state) {
    const nodes = {};
    for (const [id, node] of Object.entries(state.nodes)) {
        nodes[Number(id)] = { ...node };
    }
    return {
        ...state,
        nodes,
        order: [...state.order],
        highlights: undefined,
        message: undefined,
    };
}
function buildOrder(state) {
    if (state.headId === null || state.size === 0) {
        return [];
    }
    const order = [];
    const visited = new Set();
    let cursor = state.headId;
    while (cursor !== null && !visited.has(cursor) && order.length < state.size) {
        const node = state.nodes[cursor];
        if (!node) {
            break;
        }
        order.push(cursor);
        visited.add(cursor);
        cursor = node.nextId;
    }
    return order;
}
function normalizeState(state) {
    return {
        ...state,
        order: buildOrder(state),
        size: Object.keys(state.nodes).length,
    };
}
function createStep(id, title, description, state, complexity, isError = false) {
    return {
        id,
        title,
        description,
        snapshot: normalizeState(state),
        complexity,
        isError,
    };
}
function removeNode(state, targetId) {
    const target = state.nodes[targetId];
    if (!target) {
        return;
    }
    if (state.size === 1) {
        delete state.nodes[targetId];
        state.headId = null;
        state.tailId = null;
        state.size = 0;
        state.order = [];
        return;
    }
    const prev = state.nodes[target.prevId];
    const next = state.nodes[target.nextId];
    if (!prev || !next) {
        return;
    }
    prev.nextId = next.id;
    next.prevId = prev.id;
    if (state.headId === targetId) {
        state.headId = next.id;
    }
    if (state.tailId === targetId) {
        state.tailId = prev.id;
    }
    delete state.nodes[targetId];
    state.size -= 1;
}
function createEmptyListState() {
    return {
        nodes: {},
        order: [],
        headId: null,
        tailId: null,
        size: 0,
    };
}
function randomInit(count) {
    const state = createEmptyListState();
    for (let i = 0; i < count; i += 1) {
        const value = Math.floor(Math.random() * 90) + 10;
        const newId = nextNodeId();
        if (state.headId === null || state.tailId === null) {
            state.nodes[newId] = {
                id: newId,
                value,
                prevId: newId,
                nextId: newId,
            };
            state.headId = newId;
            state.tailId = newId;
            state.size = 1;
            continue;
        }
        const head = state.nodes[state.headId];
        const tail = state.nodes[state.tailId];
        state.nodes[newId] = {
            id: newId,
            value,
            prevId: tail.id,
            nextId: head.id,
        };
        tail.nextId = newId;
        head.prevId = newId;
        state.tailId = newId;
        state.size += 1;
    }
    const finalState = normalizeState(state);
    const steps = [
        createStep("random-init", "Random Init", `${count}개의 노드로 리스트를 초기화했습니다.`, {
            ...finalState,
            highlights: {
                nodeIds: finalState.order,
                pointers: ["head", "tail"],
            },
        }, { timeWorst: "O(n)", spaceWorst: "O(n)" }),
    ];
    return {
        steps,
        finalState,
    };
}
function insertHead(state, value) {
    const working = cloneState(state);
    const steps = [];
    const newId = nextNodeId();
    steps.push(createStep("insert-head-1", "새 노드 생성", `값 ${value}를 가진 노드를 생성합니다.`, {
        ...working,
        highlights: { nodeIds: [newId] },
        message: "아직 연결 전",
    }, COMPLEXITY.insert));
    if (working.headId === null || working.tailId === null) {
        working.nodes[newId] = {
            id: newId,
            value,
            prevId: newId,
            nextId: newId,
        };
        working.headId = newId;
        working.tailId = newId;
        working.size = 1;
        steps.push(createStep("insert-head-2", "빈 리스트 처리", "head와 tail이 새 노드를 가리키고 self-loop를 형성합니다.", {
            ...working,
            highlights: {
                nodeIds: [newId],
                pointers: ["head", "tail"],
                edgePairs: [
                    [newId, newId],
                    [newId, newId],
                ],
            },
        }, COMPLEXITY.insert));
        const finalState = normalizeState(working);
        return { steps, finalState };
    }
    const oldHead = working.nodes[working.headId];
    const oldTail = working.nodes[working.tailId];
    working.nodes[newId] = {
        id: newId,
        value,
        prevId: oldTail.id,
        nextId: oldHead.id,
    };
    steps.push(createStep("insert-head-3", "새 노드 연결 준비", "새 노드의 prev는 tail, next는 head를 가리킵니다.", {
        ...working,
        highlights: {
            nodeIds: [newId, oldHead.id, oldTail.id],
            edgePairs: [
                [newId, oldHead.id],
                [newId, oldTail.id],
            ],
        },
    }, COMPLEXITY.insert));
    oldHead.prevId = newId;
    oldTail.nextId = newId;
    steps.push(createStep("insert-head-4", "기존 head/tail 갱신", "기존 head.prev와 tail.next를 새 노드로 변경합니다.", {
        ...working,
        highlights: {
            nodeIds: [newId, oldHead.id, oldTail.id],
            edgePairs: [
                [oldTail.id, newId],
                [oldHead.id, newId],
            ],
        },
    }, COMPLEXITY.insert));
    working.headId = newId;
    working.size += 1;
    steps.push(createStep("insert-head-5", "head 포인터 이동", "head를 새 노드로 이동하고 원형 연결을 유지합니다.", {
        ...working,
        highlights: {
            nodeIds: [newId],
            pointers: ["head", "tail"],
        },
    }, COMPLEXITY.insert));
    const finalState = normalizeState(working);
    return { steps, finalState };
}
function insertTail(state, value) {
    const result = insertHead(state, value);
    const working = cloneState(result.finalState);
    const newTailId = working.headId;
    if (newTailId !== null) {
        working.headId = working.nodes[newTailId].nextId;
        working.tailId = newTailId;
    }
    const finalState = normalizeState(working);
    const lastStep = createStep("insert-tail-finish", "tail 포인터 이동", "동일한 연결 작업 뒤 tail을 새 노드로 이동합니다.", {
        ...finalState,
        highlights: {
            nodeIds: finalState.tailId === null ? [] : [finalState.tailId],
            pointers: ["head", "tail"],
        },
    }, COMPLEXITY.insert);
    return {
        steps: [...result.steps, lastStep],
        finalState,
    };
}
function removeHead(state) {
    const working = cloneState(state);
    const steps = [];
    if (working.headId === null) {
        const step = createStep("remove-head-empty", "삭제 실패", "리스트가 비어 있어 head를 삭제할 수 없습니다.", {
            ...working,
            message: "empty list",
        }, COMPLEXITY.remove, true);
        return {
            steps: [step],
            finalState: normalizeState(working),
        };
    }
    const targetId = working.headId;
    steps.push(createStep("remove-head-1", "삭제 대상 선택", "현재 head 노드를 삭제 대상으로 선택합니다.", {
        ...working,
        highlights: {
            nodeIds: [targetId],
            pointers: ["head"],
        },
    }, COMPLEXITY.remove));
    removeNode(working, targetId);
    steps.push(createStep("remove-head-2", "연결 재구성", "삭제 후 head/tail 및 원형 링크를 재정렬합니다.", {
        ...working,
        highlights: {
            pointers: ["head", "tail"],
            nodeIds: working.headId === null ? [] : [working.headId],
        },
    }, COMPLEXITY.remove));
    const finalState = normalizeState(working);
    return { steps, finalState };
}
function removeTail(state) {
    const working = cloneState(state);
    const steps = [];
    if (working.tailId === null) {
        const step = createStep("remove-tail-empty", "삭제 실패", "리스트가 비어 있어 tail을 삭제할 수 없습니다.", {
            ...working,
            message: "empty list",
        }, COMPLEXITY.remove, true);
        return {
            steps: [step],
            finalState: normalizeState(working),
        };
    }
    const targetId = working.tailId;
    steps.push(createStep("remove-tail-1", "삭제 대상 선택", "현재 tail 노드를 삭제 대상으로 선택합니다.", {
        ...working,
        highlights: {
            nodeIds: [targetId],
            pointers: ["tail"],
        },
    }, COMPLEXITY.remove));
    removeNode(working, targetId);
    steps.push(createStep("remove-tail-2", "연결 재구성", "삭제 후 head/tail 및 원형 링크를 재정렬합니다.", {
        ...working,
        highlights: {
            pointers: ["head", "tail"],
            nodeIds: working.tailId === null ? [] : [working.tailId],
        },
    }, COMPLEXITY.remove));
    const finalState = normalizeState(working);
    return { steps, finalState };
}
function searchValue(state, value) {
    const working = cloneState(state);
    const steps = [];
    if (working.headId === null) {
        const step = createStep("search-empty", "검색 실패", "리스트가 비어 있습니다.", {
            ...working,
        }, COMPLEXITY.search, true);
        return {
            steps: [step],
            finalState: normalizeState(working),
        };
    }
    let cursor = working.headId;
    for (let i = 0; i < working.size; i += 1) {
        const node = working.nodes[cursor];
        steps.push(createStep(`search-${i + 1}`, "노드 비교", `${i + 1}번째 비교: ${node.value} === ${value}`, {
            ...working,
            highlights: {
                nodeIds: [cursor],
                pointers: ["cursor"],
            },
        }, COMPLEXITY.search));
        if (node.value === value) {
            steps.push(createStep(`search-found-${i + 1}`, "검색 성공", `값 ${value}를 찾았습니다.`, {
                ...working,
                highlights: {
                    nodeIds: [cursor],
                    pointers: ["cursor"],
                },
            }, COMPLEXITY.search));
            const finalState = normalizeState(working);
            return { steps, finalState };
        }
        cursor = node.nextId;
    }
    steps.push(createStep("search-not-found", "Not Found", "한 바퀴를 순회했지만 값을 찾지 못했습니다.", {
        ...working,
    }, COMPLEXITY.search));
    const finalState = normalizeState(working);
    return { steps, finalState };
}
