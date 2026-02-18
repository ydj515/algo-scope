export type BacktrackingSnapshot = {
  depth: number;
  partial: number[];
  currentChoice: number | null;
  candidates: number[];
  detailMode?: "detailed" | "summary";
  solutions: number[][];
  stepsEmitted: number;
  visitedNodes: number;
  pruned: number;
  stoppedBy: "none" | "first_solution" | "max_steps";
  boardSize?: number;
  queenCols?: number[];
  message?: string;
};

export type BacktrackingRuntimeOptions = {
  stopAfterFirst: boolean;
  detailMode: "detailed" | "summary";
  maxSteps: number;
};
