export type DpCell = { row: number; col: number };

export type DpSnapshot = {
  rows: number;
  cols: number;
  table: number[][];
  focus: DpCell | null;
  changedCells: DpCell[];
  reconstructedPath: DpCell[];
  answer: number;
  showPath: boolean;
  message?: string;
  meta?: Record<string, string | number>;
};
