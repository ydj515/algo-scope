import {
  createEmptyListState,
  insertHead,
  insertTail,
  randomInit,
  removeHead,
  removeTail,
  searchValue,
} from "@/features/ds/cdll/operations";
import type { DsAdapter } from "@/features/visualizer/adapter";
import type { ListSnapshot, OperationResult } from "@/features/visualizer/types";

export type CdllOperation =
  | "insertHead"
  | "insertTail"
  | "removeHead"
  | "removeTail"
  | "searchValue";

function executeCdllOperation(
  state: ListSnapshot,
  operation: CdllOperation,
  value: number,
): OperationResult {
  switch (operation) {
    case "insertHead":
      return insertHead(state, value);
    case "insertTail":
      return insertTail(state, value);
    case "removeHead":
      return removeHead(state);
    case "removeTail":
      return removeTail(state);
    case "searchValue":
      return searchValue(state, value);
  }
}

export const cdllAdapter: DsAdapter<ListSnapshot, CdllOperation> = {
  id: "circular-doubly-linked-list",
  title: "Circular Doubly Linked List Visualizer",
  description: "원형 이중 연결 리스트의 연산 과정을 Step 단위로 시각화합니다.",
  operations: [
    {
      key: "insertHead",
      label: "Insert at Head",
      requiresValue: true,
      inputPlaceholder: "삽입할 숫자",
    },
    {
      key: "insertTail",
      label: "Insert at Tail",
      requiresValue: true,
      inputPlaceholder: "삽입할 숫자",
    },
    {
      key: "removeHead",
      label: "Remove at Head",
      requiresValue: false,
      inputPlaceholder: "값 불필요",
    },
    {
      key: "removeTail",
      label: "Remove at Tail",
      requiresValue: false,
      inputPlaceholder: "값 불필요",
    },
    {
      key: "searchValue",
      label: "Search by Value",
      requiresValue: true,
      inputPlaceholder: "검색할 숫자",
    },
  ],
  createInitialState: createEmptyListState,
  executeOperation: executeCdllOperation,
  randomInit,
  getStateSummary: (snapshot) => ({
    size: snapshot.size,
    head: snapshot.headId,
    tail: snapshot.tailId,
  }),
};
