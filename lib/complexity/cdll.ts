import type { ComplexityMeta } from "@/features/visualizer/types";

export const CDLL_COMPLEXITY = {
  insert: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  remove: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  search: { timeWorst: "O(n)", spaceWorst: "O(1)" },
} satisfies Record<string, ComplexityMeta>;
