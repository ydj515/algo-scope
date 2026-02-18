import type { ListSnapshot, OperationResult } from "@/features/visualizer/types";

export type OperationConfig<TOperation extends string> = {
  key: TOperation;
  label: string;
  requiresValue?: boolean;
  inputPlaceholder?: string;
};

export interface DsAdapter<
  TState extends ListSnapshot,
  TOperation extends string,
> {
  id: string;
  title: string;
  description?: string;
  operations: OperationConfig<TOperation>[];
  createInitialState: () => TState;
  executeOperation: (
    state: TState,
    operation: TOperation,
    value: number,
  ) => OperationResult;
  randomInit?: (count: number) => OperationResult;
  getStateSummary: (snapshot: TState) => Record<string, string | number | null>;
}
