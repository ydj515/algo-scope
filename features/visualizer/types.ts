export type PointerName = "head" | "tail" | "cursor";

export type ComplexityMeta = {
  timeWorst: string;
  spaceWorst: string;
};

export type VisualNode = {
  id: number;
  value: number;
  prevId: number;
  nextId: number;
};

export type ListSnapshot = {
  nodes: Record<number, VisualNode>;
  order: number[];
  headId: number | null;
  tailId: number | null;
  size: number;
  highlights?: {
    nodeIds?: number[];
    edgePairs?: Array<[number, number]>;
    pointers?: PointerName[];
  };
  message?: string;
};

export type Step = {
  id: string;
  title: string;
  description: string;
  snapshot: ListSnapshot;
  complexity: ComplexityMeta;
  isError?: boolean;
};

export type OperationResult = {
  steps: Step[];
  finalState: ListSnapshot;
};
