import type { ComplexityMeta } from "@/features/visualizer/types";

/**
 * 스택 연산별 최악 시간/공간 복잡도 메타데이터입니다.
 * 공통 UI가 push/pop/peek의 복잡도를 직접 조회할 수 있도록 분리해 둡니다.
 */
export const STACK_COMPLEXITY = {
  push: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  pop: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  peek: { timeWorst: "O(1)", spaceWorst: "O(1)" },
} satisfies Record<string, ComplexityMeta>;
