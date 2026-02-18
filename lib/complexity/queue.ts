import type { ComplexityMeta } from "@/features/visualizer/types";

export const QUEUE_COMPLEXITY = {
  enqueue: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  dequeue: { timeWorst: "O(1)", spaceWorst: "O(1)" },
  peek: { timeWorst: "O(1)", spaceWorst: "O(1)" },
} satisfies Record<string, ComplexityMeta>;
