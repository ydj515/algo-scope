import type { ComplexityMeta } from "@/features/visualizer/types";

export const STACK_COMPLEXITY = {
  push: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  pop: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  peek: { timeWorst: "O(1)", spaceWorst: "O(1)" },
} satisfies Record<string, ComplexityMeta>;
