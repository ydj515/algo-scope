import type { ComplexityMeta } from "@/features/visualizer/types";

export const TREE_COMPLEXITY = {
  insert: { timeWorst: "O(n)", spaceWorst: "O(1)" },
  search: { timeWorst: "O(n)", spaceWorst: "O(1)" },
} satisfies Record<string, ComplexityMeta>;
