import type { TraceResult } from "@/features/trace/types";

export type InputFieldType = "number" | "text" | "textarea" | "select" | "checkbox";

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

export type ParseResult<TInput> =
  | { ok: true; value: TInput }
  | { ok: false; error: string };

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
