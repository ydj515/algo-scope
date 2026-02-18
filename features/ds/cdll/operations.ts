import type {
  ComplexityMeta,
  ListSnapshot,
  OperationResult,
  Step,
  VisualNode,
} from "@/features/visualizer/types";

const COMPLEXITY = {
  insert: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  remove: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  search: { timeWorst: "O(n)", spaceWorst: "O(1)" },
} satisfies Record<string, ComplexityMeta>;

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
    const node = state.nodes[cursor] as VisualNode | undefined;
    if (!node) {
      break;
    }

    order.push(cursor);
    visited.add(cursor);
    cursor = node.nextId;
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
  state: ListSnapshot,
  complexity: ComplexityMeta,
  isError = false,
): Step {
  return {
    id,
    title,
    description,
    snapshot: normalizeState(state),
    complexity,
    isError,
  };
}

function removeNode(state: ListSnapshot, targetId: number): void {
  const target = state.nodes[targetId] as VisualNode | undefined;
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

  const prev = state.nodes[target.prevId] as VisualNode | undefined;
  const next = state.nodes[target.nextId] as VisualNode | undefined;

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

export function createEmptyListState(): ListSnapshot {
  return {
    nodes: {},
    order: [],
    headId: null,
    tailId: null,
    size: 0,
    nextId: 1,
  };
}

export function randomInit(count: number): OperationResult {
  const state = createEmptyListState();

  for (let i = 0; i < count; i += 1) {
    const value = Math.floor(Math.random() * 90) + 10;
    const newId = allocateNodeId(state);

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

    const head = getNode(state, state.headId);
    const tail = getNode(state, state.tailId);

    if (!head || !tail) {
      // 비정상 상태가 감지되면 새 노드 단일 리스트로 복구
      state.nodes = {
        [newId]: {
          id: newId,
          value,
          prevId: newId,
          nextId: newId,
        },
      };
      state.headId = newId;
      state.tailId = newId;
      state.size = 1;
      continue;
    }

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
    createStep(
      "random-init",
      "Random Init",
      `${count}개의 노드로 리스트를 초기화했습니다.`,
      {
        ...finalState,
        highlights: {
          nodeIds: finalState.order,
          pointers: ["head", "tail"],
        },
      },
      { timeWorst: "O(n)", spaceWorst: "O(n)" },
    ),
  ];

  return {
    steps,
    finalState,
  };
}

export function insertHead(state: ListSnapshot, value: number): OperationResult {
  const working = cloneState(state);
  const steps: Step[] = [];
  const newId = allocateNodeId(working);

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

    steps.push(
      createStep(
        "insert-head-1",
        "새 노드 생성",
        `값 ${value}를 가진 노드를 생성합니다.`,
        {
          ...working,
          highlights: { nodeIds: [newId], pointers: ["head", "tail"] },
        },
        COMPLEXITY.insert,
      ),
    );

    steps.push(
      createStep(
        "insert-head-2",
        "빈 리스트 처리",
        "head와 tail이 새 노드를 가리키고 self-loop를 형성합니다.",
        {
          ...working,
          highlights: {
            nodeIds: [newId],
            pointers: ["head", "tail"],
            edgePairs: [
              [newId, newId],
              [newId, newId],
            ],
          },
        },
        COMPLEXITY.insert,
      ),
    );

    const finalState = normalizeState(working);
    return { steps, finalState };
  }

  const oldHead = getNode(working, working.headId);
  const oldTail = getNode(working, working.tailId);

  if (!oldHead || !oldTail) {
    const errorStep = createStep(
      "insert-head-corrupted",
      "연결 오류",
      "head/tail 노드를 찾을 수 없어 삽입을 중단했습니다.",
      {
        ...working,
        message: "corrupted state: missing head or tail node",
      },
      COMPLEXITY.insert,
      true,
    );

    const finalState = normalizeState(working);
    return { steps: [...steps, errorStep], finalState };
  }

  working.nodes[newId] = {
    id: newId,
    value,
    prevId: oldTail.id,
    nextId: oldHead.id,
  };

  // 순방향(next) 순회 경로에 새 노드를 먼저 연결해 생성 step부터 시각화되도록 처리
  oldTail.nextId = newId;

  steps.push(
    createStep(
      "insert-head-1",
      "새 노드 생성",
      `값 ${value}를 가진 노드를 생성하고 tail 다음에 연결합니다.`,
      {
        ...working,
        highlights: {
          nodeIds: [newId, oldHead.id, oldTail.id],
          edgePairs: [
            [oldTail.id, newId],
            [newId, oldHead.id],
          ],
        },
      },
      COMPLEXITY.insert,
    ),
  );

  steps.push(
    createStep(
      "insert-head-3",
      "기존 head 갱신 준비",
      "기존 head.prev를 새 노드로 변경해 양방향 연결을 완성합니다.",
      {
        ...working,
        highlights: {
          nodeIds: [newId, oldHead.id, oldTail.id],
          edgePairs: [
            [oldHead.id, newId],
            [oldTail.id, newId],
          ],
        },
      },
      COMPLEXITY.insert,
    ),
  );

  oldHead.prevId = newId;

  working.headId = newId;
  working.size += 1;

  steps.push(
    createStep(
      "insert-head-5",
      "head 포인터 이동",
      "head를 새 노드로 이동하고 원형 연결을 유지합니다.",
      {
        ...working,
        highlights: {
          nodeIds: [newId],
          pointers: ["head", "tail"],
        },
      },
      COMPLEXITY.insert,
    ),
  );

  const finalState = normalizeState(working);
  return { steps, finalState };
}

export function insertTail(state: ListSnapshot, value: number): OperationResult {
  const result = insertHead(state, value);
  const working = cloneState(result.finalState);
  const newTailId = working.headId;

  if (newTailId !== null) {
    const newTail = getNode(working, newTailId);
    if (!newTail) {
      const errorStep = createStep(
        "insert-tail-corrupted",
        "연결 오류",
        "새 tail 노드를 찾을 수 없어 tail 이동을 중단했습니다.",
        {
          ...working,
          message: "corrupted state: missing new tail node",
        },
        COMPLEXITY.insert,
        true,
      );

      const finalState = normalizeState(working);
      return {
        steps: [...result.steps, errorStep],
        finalState,
      };
    }

    working.headId = newTail.nextId;
    working.tailId = newTailId;
  }

  const finalState = normalizeState(working);
  const lastStep = createStep(
    "insert-tail-finish",
    "tail 포인터 이동",
    "동일한 연결 작업 뒤 tail을 새 노드로 이동합니다.",
    {
      ...finalState,
      highlights: {
        nodeIds: finalState.tailId === null ? [] : [finalState.tailId],
        pointers: ["head", "tail"],
      },
    },
    COMPLEXITY.insert,
  );

  return {
    steps: [...result.steps, lastStep],
    finalState,
  };
}

export function removeHead(state: ListSnapshot): OperationResult {
  const working = cloneState(state);
  const steps: Step[] = [];

  if (working.headId === null) {
    const step = createStep(
      "remove-head-empty",
      "삭제 실패",
      "리스트가 비어 있어 head를 삭제할 수 없습니다.",
      {
        ...working,
        message: "empty list",
      },
      COMPLEXITY.remove,
      true,
    );

    return {
      steps: [step],
      finalState: normalizeState(working),
    };
  }

  const targetId = working.headId;

  steps.push(
    createStep(
      "remove-head-1",
      "삭제 대상 선택",
      "현재 head 노드를 삭제 대상으로 선택합니다.",
      {
        ...working,
        highlights: {
          nodeIds: [targetId],
          pointers: ["head"],
        },
      },
      COMPLEXITY.remove,
    ),
  );

  removeNode(working, targetId);

  steps.push(
    createStep(
      "remove-head-2",
      "연결 재구성",
      "삭제 후 head/tail 및 원형 링크를 재정렬합니다.",
      {
        ...working,
        highlights: {
          pointers: ["head", "tail"],
          nodeIds: working.headId === null ? [] : [working.headId],
        },
      },
      COMPLEXITY.remove,
    ),
  );

  const finalState = normalizeState(working);
  return { steps, finalState };
}

export function removeTail(state: ListSnapshot): OperationResult {
  const working = cloneState(state);
  const steps: Step[] = [];

  if (working.tailId === null) {
    const step = createStep(
      "remove-tail-empty",
      "삭제 실패",
      "리스트가 비어 있어 tail을 삭제할 수 없습니다.",
      {
        ...working,
        message: "empty list",
      },
      COMPLEXITY.remove,
      true,
    );

    return {
      steps: [step],
      finalState: normalizeState(working),
    };
  }

  const targetId = working.tailId;

  steps.push(
    createStep(
      "remove-tail-1",
      "삭제 대상 선택",
      "현재 tail 노드를 삭제 대상으로 선택합니다.",
      {
        ...working,
        highlights: {
          nodeIds: [targetId],
          pointers: ["tail"],
        },
      },
      COMPLEXITY.remove,
    ),
  );

  removeNode(working, targetId);

  steps.push(
    createStep(
      "remove-tail-2",
      "연결 재구성",
      "삭제 후 head/tail 및 원형 링크를 재정렬합니다.",
      {
        ...working,
        highlights: {
          pointers: ["head", "tail"],
          nodeIds: working.tailId === null ? [] : [working.tailId],
        },
      },
      COMPLEXITY.remove,
    ),
  );

  const finalState = normalizeState(working);
  return { steps, finalState };
}

export function searchValue(state: ListSnapshot, value: number): OperationResult {
  const working = cloneState(state);
  const steps: Step[] = [];

  if (working.headId === null) {
    const step = createStep(
      "search-empty",
      "검색 실패",
      "리스트가 비어 있습니다.",
      {
        ...working,
      },
      COMPLEXITY.search,
      true,
    );

    return {
      steps: [step],
      finalState: normalizeState(working),
    };
  }

  let cursor = working.headId;

  for (let i = 0; i < working.size; i += 1) {
    const node = getNode(working, cursor);
    if (!node) {
      steps.push(
        createStep(
          `search-corrupted-${i + 1}`,
          "검색 오류",
          "순회 중 연결이 손상된 노드를 감지해 검색을 중단했습니다.",
          {
            ...working,
            message: "corrupted state: missing node in search traversal",
            highlights: {
              pointers: ["cursor"],
            },
          },
          COMPLEXITY.search,
          true,
        ),
      );

      const finalState = normalizeState(working);
      return { steps, finalState };
    }

    steps.push(
      createStep(
        `search-${i + 1}`,
        "노드 비교",
        `${i + 1}번째 비교: ${node.value} === ${value}`,
        {
          ...working,
          highlights: {
            nodeIds: [cursor],
            pointers: ["cursor"],
          },
        },
        COMPLEXITY.search,
      ),
    );

    if (node.value === value) {
      steps.push(
        createStep(
          `search-found-${i + 1}`,
          "검색 성공",
          `값 ${value}를 찾았습니다.`,
          {
            ...working,
            highlights: {
              nodeIds: [cursor],
              pointers: ["cursor"],
            },
          },
          COMPLEXITY.search,
        ),
      );

      const finalState = normalizeState(working);
      return { steps, finalState };
    }

    cursor = node.nextId;
  }

  steps.push(
    createStep(
      "search-not-found",
      "Not Found",
      "한 바퀴를 순회했지만 값을 찾지 못했습니다.",
      {
        ...working,
      },
      COMPLEXITY.search,
    ),
  );

  const finalState = normalizeState(working);
  return { steps, finalState };
}
