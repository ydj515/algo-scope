import type { ListSnapshot, OperationResult } from "@/features/visualizer/types";

/**
 * 개별 자료구조가 노출하는 연산 버튼의 메타데이터입니다.
 * UI는 이 설정을 기반으로 라벨, 입력 필요 여부, placeholder를 동적으로 구성합니다.
 */
export type OperationConfig<TOperation extends string> = {
  key: TOperation;
  label: string;
  requiresValue?: boolean;
  inputPlaceholder?: string;
};

/**
 * 자료구조별 구현을 공통 VisualizerShell에 연결하기 위한 어댑터 계약입니다.
 * 생성, 실행, 랜덤 초기화, 요약 정보 제공 방식을 표준화해 각 자료구조 페이지가 동일한 흐름을 따르도록 합니다.
 */
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
