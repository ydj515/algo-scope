import type { ListSnapshot, OperationResult, Step, VisualNode } from "@/features/visualizer/types";
import { QUEUE_COMPLEXITY } from "../../../lib/complexity/queue";

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
  complexity: (typeof QUEUE_COMPLEXITY)[keyof typeof QUEUE_COMPLEXITY],
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

export function createEmptyQueueState(): ListSnapshot {
  return {
    nodes: {},
    order: [],
    headId: null,
    tailId: null,
    size: 0,
    nextId: 1,
  };
}

export function randomInitQueue(count: number): OperationResult {
  let state = createEmptyQueueState();
  for (let i = 0; i < count; i += 1) {
    const value = Math.floor(Math.random() * 90) + 10;
    state = enqueue(state, value).finalState;
  }

  const finalState = normalizeState(state);
  return {
    steps: [
      createStep(
        "queue-random-init",
        "Random Init",
        `${count}개의 값을 queue에 enqueue했습니다.`,
        {
          ...finalState,
          highlights: {
            nodeIds: finalState.order,
            pointers: ["head", "tail"],
          },
        },
        { timeWorst: "O(n)", spaceWorst: "O(n)" },
      ),
    ],
    finalState,
  };
}

export function enqueue(state: ListSnapshot, value: number): OperationResult {
  const working = cloneState(state);
  const steps: Step[] = [];
  const newId = allocateNodeId(working);

  const oldTail = getNode(working, working.tailId);

  working.nodes[newId] = {
    id: newId,
    value,
    prevId: oldTail?.id ?? newId,
    nextId: newId,
  };

  if (oldTail) {
    oldTail.nextId = newId;
  }

  if (working.headId === null) {
    working.headId = newId;
  }
  working.tailId = newId;
  working.size += 1;

  steps.push(
    createStep(
      "queue-enqueue-1",
      "Enqueue",
      `값 ${value}를 rear에 추가합니다.`,
      {
        ...working,
        highlights: {
          nodeIds: [newId],
          pointers: ["tail"],
        },
      },
      QUEUE_COMPLEXITY.enqueue,
    ),
  );

  return {
    steps,
    finalState: normalizeState(working),
  };
}

export function dequeue(state: ListSnapshot): OperationResult {
  const working = cloneState(state);
  const steps: Step[] = [];

  if (working.headId === null) {
    return {
      steps: [
        createStep(
          "queue-dequeue-empty",
          "Dequeue 실패",
          "queue가 비어 있어 dequeue할 수 없습니다.",
          {
            ...working,
            message: "empty queue",
          },
          QUEUE_COMPLEXITY.dequeue,
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
          "queue-dequeue-corrupted",
          "Dequeue 오류",
          "front 노드를 찾을 수 없어 dequeue를 중단했습니다.",
          {
            ...working,
            message: "corrupted state: missing front node",
          },
          QUEUE_COMPLEXITY.dequeue,
          true,
        ),
      ],
      finalState: normalizeState(working),
    };
  }

  steps.push(
    createStep(
      "queue-dequeue-1",
      "삭제 대상 선택",
      `front 값 ${target.value}를 dequeue합니다.`,
      {
        ...working,
        highlights: {
          nodeIds: [targetId],
          pointers: ["head"],
        },
      },
      QUEUE_COMPLEXITY.dequeue,
    ),
  );

  if (working.size === 1) {
    delete working.nodes[targetId];
    working.headId = null;
    working.tailId = null;
    working.size = 0;
  } else {
    const nextFront = getNode(working, target.nextId);
    if (!nextFront) {
      return {
        steps: [
          ...steps,
          createStep(
            "queue-dequeue-corrupted-next",
            "Dequeue 오류",
            "다음 front 노드를 찾을 수 없어 dequeue를 중단했습니다.",
            {
              ...working,
              message: "corrupted state: missing next front node",
            },
            QUEUE_COMPLEXITY.dequeue,
            true,
          ),
        ],
        finalState: normalizeState(working),
      };
    }

    working.headId = nextFront.id;
    nextFront.prevId = nextFront.id;
    delete working.nodes[targetId];
    working.size -= 1;
  }

  steps.push(
    createStep(
      "queue-dequeue-2",
      "front 갱신",
      "dequeue 후 front 포인터를 갱신합니다.",
      {
        ...working,
        highlights: {
          nodeIds: working.headId === null ? [] : [working.headId],
          pointers: ["head"],
        },
      },
      QUEUE_COMPLEXITY.dequeue,
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
          "queue-peek-empty",
          "Peek 실패",
          "queue가 비어 있습니다.",
          {
            ...working,
            message: "empty queue",
          },
          QUEUE_COMPLEXITY.peek,
          true,
        ),
      ],
      finalState: normalizeState(working),
    };
  }

  const front = getNode(working, working.headId);
  if (!front) {
    return {
      steps: [
        createStep(
          "queue-peek-corrupted",
          "Peek 오류",
          "front 노드를 찾을 수 없습니다.",
          {
            ...working,
            message: "corrupted state: missing front node",
          },
          QUEUE_COMPLEXITY.peek,
          true,
        ),
      ],
      finalState: normalizeState(working),
    };
  }

  return {
    steps: [
      createStep(
        "queue-peek-1",
        "Peek",
        `현재 front 값은 ${front.value} 입니다.`,
        {
          ...working,
          highlights: {
            nodeIds: [front.id],
            pointers: ["head"],
          },
        },
        QUEUE_COMPLEXITY.peek,
      ),
    ],
    finalState: normalizeState(working),
  };
}
