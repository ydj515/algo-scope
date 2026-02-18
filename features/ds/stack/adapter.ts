import type { DsAdapter } from "@/features/visualizer/adapter";
import type { ListSnapshot, OperationResult } from "@/features/visualizer/types";
import { createEmptyStackState, peek, pop, push, randomInitStack } from "@/features/ds/stack/operations";

export type StackOperation = "push" | "pop" | "peek";

function executeStackOperation(
  state: ListSnapshot,
  operation: StackOperation,
  value: number,
): OperationResult {
  switch (operation) {
    case "push":
      return push(state, value);
    case "pop":
      return pop(state);
    case "peek":
      return peek(state);
  }
}

export const stackAdapter: DsAdapter<ListSnapshot, StackOperation> = {
  id: "stack",
  title: "Stack Visualizer",
  description: "스택의 push/pop/peek 연산을 Step 단위로 시각화합니다.",
  operations: [
    {
      key: "push",
      label: "Push",
      requiresValue: true,
      inputPlaceholder: "push할 숫자",
    },
    {
      key: "pop",
      label: "Pop",
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
  createInitialState: createEmptyStackState,
  executeOperation: executeStackOperation,
  randomInit: randomInitStack,
  getStateSummary: (snapshot) => ({
    size: snapshot.size,
    top: snapshot.headId,
    bottom: snapshot.tailId,
  }),
};
