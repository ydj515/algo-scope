import type { ComplexityMeta } from "@/features/visualizer/types";

/**
 * 원형 이중 연결 리스트 연산별 최악 시간/공간 복잡도 메타데이터입니다.
 * 시각화 패널과 요약 UI에서 연산 복잡도를 일관되게 표시할 때 사용합니다.
 */
export const CDLL_COMPLEXITY = {
  insert: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  remove: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  search: { timeWorst: "O(n)", spaceWorst: "O(1)" },
} satisfies Record<string, ComplexityMeta>;
