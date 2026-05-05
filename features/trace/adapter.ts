import type { TraceResult } from "@/features/trace/types";

/**
 * trace 입력 폼에서 지원하는 필드 렌더링 타입입니다.
 */
export type InputFieldType = "number" | "text" | "textarea" | "select" | "checkbox";

/**
 * 문제별 입력 폼 한 칸을 정의하는 메타데이터입니다.
 * 라벨, placeholder, 표시 조건을 선언적으로 기술해 공통 폼 렌더러가 그대로 소비합니다.
 */
export type InputFieldConfig<TInput extends Record<string, string>> = {
  key: keyof TInput & string;
  label: string;
  type: InputFieldType;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  group?: string;
  visible?: (input: TInput) => boolean;
};

/**
 * 자유 입력 텍스트를 실제 문제 입력 객체로 파싱한 결과 타입입니다.
 * 성공 여부와 오류 메시지를 분리해 호출 측이 예외 없이 사용자 피드백을 구성할 수 있게 합니다.
 */
export type ParseResult<TInput> =
  | { ok: true; value: TInput }
  | { ok: false; error: string };

/**
 * 개별 알고리즘 문제를 공통 TraceShell과 연결하기 위한 어댑터 계약입니다.
 * 입력 정의, 직렬화/역직렬화, 실행, 결과 요약 방식을 한 인터페이스로 묶습니다.
 */
export interface ProblemTraceAdapter<
  TInput extends Record<string, string>,
  TSnapshot,
> {
  id: string;
  title: string;
  description?: string;
  inputFields: Array<InputFieldConfig<TInput>>;
  createDefaultInput: () => TInput;
  normalizeFormInput?: (input: TInput) => TInput;
  serializeInput: (input: TInput) => string;
  parseInputText: (text: string) => ParseResult<TInput>;
  run: (input: TInput) => TraceResult<TSnapshot>;
  getSnapshotSummary: (snapshot: TSnapshot) => Record<string, string | number | null>;
}
