import type { ListSnapshot, OperationResult, Step, VisualNode } from "@/features/visualizer/types";
import { TREE_COMPLEXITY } from "../../../lib/complexity/tree";

function allocateNodeId(state: ListSnapshot): number {
  const id = state.nextId;
  state.nextId += 1;
  return id;
}

function getNode(state: ListSnapshot, id: number | null): VisualNode | undefined {
  if (id === null) {
    return undefined;
  }
  return state.nodes[id];
}

function getLeftId(node: VisualNode): number | null {
  return node.prevId === node.id ? null : node.prevId;
}

function getRightId(node: VisualNode): number | null {
  return node.nextId === node.id ? null : node.nextId;
}

function setLeftId(node: VisualNode, id: number | null): void {
  node.prevId = id ?? node.id;
}

function setRightId(node: VisualNode, id: number | null): void {
  node.nextId = id ?? node.id;
}

function cloneState(state: ListSnapshot): ListSnapshot {
  const nodes: Record<number, VisualNode> = {};
  for (const [id, node] of Object.entries(state.nodes)) {
    nodes[Number(id)] = { ...node };
  }

  return {
    ...state,
    nodes,
    order: [...state.order],
    nextId: state.nextId,
    highlights: undefined,
    message: undefined,
  };
}

function buildOrder(state: ListSnapshot): number[] {
  if (state.headId === null || state.size === 0) {
    return [];
  }

  const order: number[] = [];
  const visited = new Set<number>();
  const queue: number[] = [state.headId];

  while (queue.length > 0 && order.length < state.size) {
    const currentId = queue.shift();
    if (currentId === undefined || visited.has(currentId)) {
      continue;
    }

    const node = getNode(state, currentId);
    if (!node) {
      continue;
    }

    visited.add(currentId);
    order.push(currentId);

    const left = getLeftId(node);
    const right = getRightId(node);
    if (left !== null) {
      queue.push(left);
    }
    if (right !== null) {
      queue.push(right);
    }
  }

  return order;
}

function normalizeState(state: ListSnapshot): ListSnapshot {
  return {
    ...state,
    order: buildOrder(state),
    size: Object.keys(state.nodes).length,
  };
}

function createStep(
  id: string,
  title: string,
  description: string,
  snapshot: ListSnapshot,
  complexity: (typeof TREE_COMPLEXITY)[keyof typeof TREE_COMPLEXITY],
  isError = false,
): Step {
  return {
    id,
    title,
    description,
    snapshot: normalizeState(snapshot),
    complexity,
    isError,
  };
}

export function createEmptyTreeState(): ListSnapshot {
  return {
    nodes: {},
    order: [],
    headId: null,
    tailId: null,
    size: 0,
    nextId: 1,
  };
}

export function randomInitTree(count: number): OperationResult {
  let state = createEmptyTreeState();
  for (let i = 0; i < count; i += 1) {
    const value = Math.floor(Math.random() * 90) + 10;
    state = insertValue(state, value).finalState;
  }

  const finalState = normalizeState(state);
  return {
    steps: [
      createStep(
        "tree-random-init",
        "Random Init",
        `${count}개의 값을 BST에 삽입했습니다.`,
        {
          ...finalState,
          highlights: {
            nodeIds: finalState.order,
            pointers: ["head"],
          },
        },
        { timeWorst: "O(n)", spaceWorst: "O(n)" },
      ),
    ],
    finalState,
  };
}

export function insertValue(state: ListSnapshot, value: number): OperationResult {
  const working = cloneState(state);
  const steps: Step[] = [];

  if (working.headId === null) {
    const newId = allocateNodeId(working);
    working.nodes[newId] = {
      id: newId,
      value,
      prevId: newId,
      nextId: newId,
    };
    working.headId = newId;
    working.tailId = newId;
    working.size = 1;

    steps.push(
      createStep(
        "tree-insert-root",
        "루트 삽입",
        `값 ${value}를 루트로 삽입합니다.`,
        {
          ...working,
          highlights: {
            nodeIds: [newId],
            pointers: ["head"],
          },
        },
        TREE_COMPLEXITY.insert,
      ),
    );

    return {
      steps,
      finalState: normalizeState(working),
    };
  }

  let cursorId: number | null = working.headId;
  let parentId: number | null = null;
  let placeOnLeft = false;

  while (cursorId !== null) {
    const cursor = getNode(working, cursorId);
    if (!cursor) {
      return {
        steps: [
          ...steps,
          createStep(
            "tree-insert-corrupted",
            "삽입 오류",
            "탐색 중 노드를 찾을 수 없어 삽입을 중단했습니다.",
            {
              ...working,
              message: "corrupted state: missing cursor node",
            },
            TREE_COMPLEXITY.insert,
            true,
          ),
        ],
        finalState: normalizeState(working),
      };
    }

    steps.push(
      createStep(
        `tree-insert-visit-${cursor.id}`,
        "삽입 위치 탐색",
        `${value} ${value < cursor.value ? "<" : ">="} ${cursor.value} 비교`,
        {
          ...working,
          highlights: {
            nodeIds: [cursor.id],
            pointers: ["cursor"],
          },
        },
        TREE_COMPLEXITY.insert,
      ),
    );

    parentId = cursor.id;
    if (value < cursor.value) {
      placeOnLeft = true;
      cursorId = getLeftId(cursor);
    } else {
      placeOnLeft = false;
      cursorId = getRightId(cursor);
    }
  }

  const parent = getNode(working, parentId);
  if (!parent) {
    return {
      steps: [
        ...steps,
        createStep(
          "tree-insert-parent-missing",
          "삽입 오류",
          "부모 노드를 찾을 수 없어 삽입을 중단했습니다.",
          {
            ...working,
            message: "corrupted state: missing parent node",
          },
          TREE_COMPLEXITY.insert,
          true,
        ),
      ],
      finalState: normalizeState(working),
    };
  }

  const newId = allocateNodeId(working);
  working.nodes[newId] = {
    id: newId,
    value,
    prevId: newId,
    nextId: newId,
  };

  if (placeOnLeft) {
    setLeftId(parent, newId);
  } else {
    setRightId(parent, newId);
  }

  working.tailId = newId;
  working.size += 1;

  steps.push(
    createStep(
      "tree-insert-attach",
      "노드 연결",
      `값 ${value}를 ${placeOnLeft ? "왼쪽" : "오른쪽"} 자식으로 연결합니다.`,
      {
        ...working,
        highlights: {
          nodeIds: [parent.id, newId],
          pointers: ["cursor"],
        },
      },
      TREE_COMPLEXITY.insert,
    ),
  );

  return {
    steps,
    finalState: normalizeState(working),
  };
}

export function searchValue(state: ListSnapshot, value: number): OperationResult {
  const working = cloneState(state);
  const steps: Step[] = [];

  if (working.headId === null) {
    return {
      steps: [
        createStep(
          "tree-search-empty",
          "검색 실패",
          "트리가 비어 있습니다.",
          {
            ...working,
            message: "empty tree",
          },
          TREE_COMPLEXITY.search,
          true,
        ),
      ],
      finalState: normalizeState(working),
    };
  }

  let cursorId: number | null = working.headId;
  let depth = 0;

  while (cursorId !== null && depth <= working.size) {
    const cursor = getNode(working, cursorId);
    if (!cursor) {
      return {
        steps: [
          ...steps,
          createStep(
            "tree-search-corrupted",
            "검색 오류",
            "탐색 중 노드를 찾을 수 없어 검색을 중단했습니다.",
            {
              ...working,
              message: "corrupted state: missing cursor node",
            },
            TREE_COMPLEXITY.search,
            true,
          ),
        ],
        finalState: normalizeState(working),
      };
    }

    steps.push(
      createStep(
        `tree-search-visit-${depth + 1}`,
        "노드 비교",
        `${cursor.value}와(과) ${value}를 비교합니다.`,
        {
          ...working,
          highlights: {
            nodeIds: [cursor.id],
            pointers: ["cursor"],
          },
        },
        TREE_COMPLEXITY.search,
      ),
    );

    if (cursor.value === value) {
      steps.push(
        createStep(
          "tree-search-found",
          "검색 성공",
          `값 ${value}를 찾았습니다.`,
          {
            ...working,
            highlights: {
              nodeIds: [cursor.id],
              pointers: ["cursor"],
            },
          },
          TREE_COMPLEXITY.search,
        ),
      );

      return {
        steps,
        finalState: normalizeState(working),
      };
    }

    cursorId = value < cursor.value ? getLeftId(cursor) : getRightId(cursor);
    depth += 1;
  }

  steps.push(
    createStep(
      "tree-search-not-found",
      "검색 실패",
      `값 ${value}를 찾지 못했습니다.`,
      {
        ...working,
        message: "value not found",
      },
      TREE_COMPLEXITY.search,
      true,
    ),
  );

  return {
    steps,
    finalState: normalizeState(working),
  };
}
