import type { ListSnapshot, OperationResult, Step, VisualNode } from "@/features/visualizer/types";
import { STACK_COMPLEXITY } from "../../../lib/complexity/stack";

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
  let cursor: number | null = state.headId;

  while (cursor !== null && !visited.has(cursor) && order.length < state.size) {
    const node = getNode(state, cursor);
    if (!node) {
      break;
    }
    order.push(cursor);
    visited.add(cursor);
    cursor = node.nextId === cursor ? null : node.nextId;
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
  complexity: (typeof STACK_COMPLEXITY)[keyof typeof STACK_COMPLEXITY],
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

export function createEmptyStackState(): ListSnapshot {
  return {
    nodes: {},
    order: [],
    headId: null,
    tailId: null,
    size: 0,
    nextId: 1,
  };
}

export function randomInitStack(count: number): OperationResult {
  let state = createEmptyStackState();
  for (let i = 0; i < count; i += 1) {
    const value = Math.floor(Math.random() * 90) + 10;
    state = push(state, value).finalState;
  }

  const finalState = normalizeState(state);
  return {
    steps: [
      createStep(
        "stack-random-init",
        "Random Init",
        `${count}개의 값을 스택에 push했습니다.`,
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

export function push(state: ListSnapshot, value: number): OperationResult {
  const working = cloneState(state);
  const steps: Step[] = [];
  const newId = allocateNodeId(working);

  const oldTop = getNode(working, working.headId);

  working.nodes[newId] = {
    id: newId,
    value,
    prevId: oldTop?.id ?? newId,
    nextId: oldTop?.id ?? newId,
  };

  if (oldTop) {
    oldTop.prevId = newId;
  }

  working.headId = newId;
  if (working.tailId === null) {
    working.tailId = newId;
  }
  working.size += 1;

  steps.push(
    createStep(
      "stack-push-1",
      "값 push",
      `값 ${value}를 스택 top에 추가합니다.`,
      {
        ...working,
        highlights: {
          nodeIds: [newId],
          pointers: ["head"],
        },
      },
      STACK_COMPLEXITY.push,
    ),
  );

  return {
    steps,
    finalState: normalizeState(working),
  };
}

export function pop(state: ListSnapshot): OperationResult {
  const working = cloneState(state);
  const steps: Step[] = [];

  if (working.headId === null) {
    return {
      steps: [
        createStep(
          "stack-pop-empty",
          "Pop 실패",
          "스택이 비어 있어 pop할 수 없습니다.",
          {
            ...working,
            message: "empty stack",
          },
          STACK_COMPLEXITY.pop,
          true,
        ),
      ],
      finalState: normalizeState(working),
    };
  }

  const targetId = working.headId;
  const target = getNode(working, targetId);

  if (!target) {
    return {
      steps: [
        createStep(
          "stack-pop-corrupted",
          "Pop 오류",
          "top 노드를 찾을 수 없어 pop을 중단했습니다.",
          {
            ...working,
            message: "corrupted state: missing top node",
          },
          STACK_COMPLEXITY.pop,
          true,
        ),
      ],
      finalState: normalizeState(working),
    };
  }

  steps.push(
    createStep(
      "stack-pop-1",
      "삭제 대상 선택",
      `top 값 ${target.value}를 pop합니다.`,
      {
        ...working,
        highlights: {
          nodeIds: [targetId],
          pointers: ["head"],
        },
      },
      STACK_COMPLEXITY.pop,
    ),
  );

  if (working.size === 1) {
    delete working.nodes[targetId];
    working.headId = null;
    working.tailId = null;
    working.size = 0;
  } else {
    const nextTop = getNode(working, target.nextId);
    if (!nextTop) {
      return {
        steps: [
          ...steps,
          createStep(
            "stack-pop-corrupted-next",
            "Pop 오류",
            "다음 top 노드를 찾을 수 없어 pop을 중단했습니다.",
            {
              ...working,
              message: "corrupted state: missing next top node",
            },
            STACK_COMPLEXITY.pop,
            true,
          ),
        ],
        finalState: normalizeState(working),
      };
    }

    working.headId = nextTop.id;
    nextTop.prevId = nextTop.id;
    delete working.nodes[targetId];
    working.size -= 1;
  }

  steps.push(
    createStep(
      "stack-pop-2",
      "top 갱신",
      "pop 후 top 포인터를 갱신합니다.",
      {
        ...working,
        highlights: {
          nodeIds: working.headId === null ? [] : [working.headId],
          pointers: ["head"],
        },
      },
      STACK_COMPLEXITY.pop,
    ),
  );

  return {
    steps,
    finalState: normalizeState(working),
  };
}

export function peek(state: ListSnapshot): OperationResult {
  const working = cloneState(state);

  if (working.headId === null) {
    return {
      steps: [
        createStep(
          "stack-peek-empty",
          "Peek 실패",
          "스택이 비어 있습니다.",
          {
            ...working,
            message: "empty stack",
          },
          STACK_COMPLEXITY.peek,
          true,
        ),
      ],
      finalState: normalizeState(working),
    };
  }

  const top = getNode(working, working.headId);
  if (!top) {
    return {
      steps: [
        createStep(
          "stack-peek-corrupted",
          "Peek 오류",
          "top 노드를 찾을 수 없습니다.",
          {
            ...working,
            message: "corrupted state: missing top node",
          },
          STACK_COMPLEXITY.peek,
          true,
        ),
      ],
      finalState: normalizeState(working),
    };
  }

  return {
    steps: [
      createStep(
        "stack-peek-1",
        "Peek",
        `현재 top 값은 ${top.value} 입니다.`,
        {
          ...working,
          highlights: {
            nodeIds: [top.id],
            pointers: ["head"],
          },
        },
        STACK_COMPLEXITY.peek,
      ),
    ],
    finalState: normalizeState(working),
  };
}
