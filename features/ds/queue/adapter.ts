import type { DsAdapter } from "@/features/visualizer/adapter";
import type { ListSnapshot, OperationResult } from "@/features/visualizer/types";
import { createEmptyQueueState, dequeue, enqueue, peek, randomInitQueue } from "@/features/ds/queue/operations";

export type QueueOperation = "enqueue" | "dequeue" | "peek";

function executeQueueOperation(
  state: ListSnapshot,
  operation: QueueOperation,
  value: number,
): OperationResult {
  switch (operation) {
    case "enqueue":
      return enqueue(state, value);
    case "dequeue":
      return dequeue(state);
    case "peek":
      return peek(state);
  }
}

export const queueAdapter: DsAdapter<ListSnapshot, QueueOperation> = {
  id: "queue",
  title: "Queue Visualizer",
  description: "큐의 enqueue/dequeue/peek 연산을 Step 단위로 시각화합니다.",
  operations: [
    {
      key: "enqueue",
      label: "Enqueue",
      requiresValue: true,
      inputPlaceholder: "enqueue할 숫자",
    },
    {
      key: "dequeue",
      label: "Dequeue",
      requiresValue: false,
      inputPlaceholder: "값 불필요",
    },
    {
      key: "peek",
      label: "Peek",
      requiresValue: false,
      inputPlaceholder: "값 불필요",
    },
  ],
  createInitialState: createEmptyQueueState,
  executeOperation: executeQueueOperation,
  randomInit: randomInitQueue,
  getStateSummary: (snapshot) => ({
    size: snapshot.size,
    front: snapshot.headId,
    rear: snapshot.tailId,
  }),
};
