import type { ComplexityMeta } from "@/features/visualizer/types";

/**
 * 현재 트리 구현 기준 연산별 최악 시간/공간 복잡도 메타데이터입니다.
 * 균형 보정이 없는 일반 이진 탐색 트리 시나리오를 가정해 UI 설명에 사용합니다.
 */
export const TREE_COMPLEXITY = {
  insert: { timeWorst: "O(n)", spaceWorst: "O(1)" },
  search: { timeWorst: "O(n)", spaceWorst: "O(1)" },
} satisfies Record<string, ComplexityMeta>;
