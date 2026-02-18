export type TracePhase = "enter" | "update" | "prune" | "exit";

export type TraceComplexity = {
  timeWorst: string;
  spaceWorst: string;
};

export type TraceStep<TSnapshot> = {
  id: string;
  title: string;
  description: string;
  phase: TracePhase;
  snapshot: TSnapshot;
  complexity: TraceComplexity;
  isError?: boolean;
};

export type TraceResult<TSnapshot> = {
  steps: Array<TraceStep<TSnapshot>>;
  finalSnapshot: TSnapshot;
};
