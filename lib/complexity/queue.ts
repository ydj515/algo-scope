import type { ComplexityMeta } from "@/features/visualizer/types";

/**
 * 큐 연산별 최악 시간/공간 복잡도 메타데이터입니다.
 * 자료구조 시각화 화면에서 enqueue/dequeue/peek 설명에 재사용합니다.
 */
export const QUEUE_COMPLEXITY = {
  enqueue: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  dequeue: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  peek: { timeWorst: "O(1)", spaceWorst: "O(1)" },
} satisfies Record<string, ComplexityMeta>;
