import type { DsAdapter } from "@/features/visualizer/adapter";
import type { ListSnapshot, OperationResult } from "@/features/visualizer/types";
import { createEmptyTreeState, insertValue, randomInitTree, searchValue } from "@/features/ds/tree/operations";

export type TreeOperation = "insert" | "search";

function executeTreeOperation(
  state: ListSnapshot,
  operation: TreeOperation,
  value: number,
): OperationResult {
  switch (operation) {
    case "insert":
      return insertValue(state, value);
    case "search":
      return searchValue(state, value);
  }
}

export const treeAdapter: DsAdapter<ListSnapshot, TreeOperation> = {
  id: "tree",
  title: "Tree Visualizer",
  description: "이진 탐색 트리(BST)의 insert/search 연산을 Step 단위로 시각화합니다.",
  operations: [
    {
      key: "insert",
      label: "Insert",
      requiresValue: true,
      inputPlaceholder: "삽입할 숫자",
    },
    {
      key: "search",
      label: "Search",
      requiresValue: true,
      inputPlaceholder: "검색할 숫자",
    },
  ],
  createInitialState: createEmptyTreeState,
  executeOperation: executeTreeOperation,
  randomInit: randomInitTree,
  getStateSummary: (snapshot) => ({
    size: snapshot.size,
    root: snapshot.headId,
    lastInserted: snapshot.tailId,
  }),
};
