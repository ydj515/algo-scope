"use client";

import Link from "next/link";
import { useMemo, useState, type ComponentType } from "react";
import type { ProblemTraceAdapter } from "@/features/trace/adapter";
import type { TraceStep } from "@/features/trace/types";
import { useTraceStepper } from "@/features/trace/use-trace-stepper";

type RendererProps<TSnapshot> = {
  snapshot: TSnapshot | null;
};

type Props<TInput extends Record<string, string>, TSnapshot> = {
  adapter: ProblemTraceAdapter<TInput, TSnapshot>;
  Renderer: ComponentType<RendererProps<TSnapshot>>;
  homeHref?: string;
};

function makeInputErrorStep<TSnapshot>(message: string, snapshot: TSnapshot): TraceStep<TSnapshot> {
  return {
    id: "input-error",
    title: "입력 오류",
    description: message,
    phase: "prune",
    snapshot,
    complexity: { timeWorst: "-", spaceWorst: "-" },
    isError: true,
  };
}

export function TraceShell<TInput extends Record<string, string>, TSnapshot>({
  adapter,
  Renderer,
  homeHref = "/",
}: Props<TInput, TSnapshot>) {
  const [formInput, setFormInput] = useState<TInput>(adapter.createDefaultInput());
  const [textInput, setTextInput] = useState(adapter.serializeInput(formInput));
  const [inputMode, setInputMode] = useState<"form" | "text">("form");
  const [inputError, setInputError] = useState<string | null>(null);

  const {
    steps,
    currentStep,
    currentIndex,
    isPlaying,
    speed,
    setSpeed,
    loadSteps,
    next,
    prev,
    play,
    pause,
    reset,
    jumpTo,
  } = useTraceStepper<TSnapshot>([]);

  const currentSnapshot = currentStep?.snapshot ?? null;

  const runFromInput = (input: TInput) => {
    setInputError(null);
    const result = adapter.run(input);
    loadSteps(result.steps, result.steps.length - 1);
  };

  const updateFormInput = (nextInput: TInput) => {
    const normalized = adapter.normalizeFormInput
      ? adapter.normalizeFormInput(nextInput)
      : nextInput;
    setFormInput(normalized);
    setTextInput(adapter.serializeInput(normalized));
  };

  const runTrace = () => {
    if (inputMode === "form") {
      runFromInput(formInput);
      return;
    }

    const parsed = adapter.parseInputText(textInput);
    if (!parsed.ok) {
      setInputError(parsed.error);
      const snapshot = currentSnapshot;
      if (snapshot) {
        loadSteps([makeInputErrorStep(parsed.error, snapshot)]);
      }
      return;
    }

    setFormInput(parsed.value);
    runFromInput(parsed.value);
  };

  const applyTextToForm = () => {
    const parsed = adapter.parseInputText(textInput);
    if (!parsed.ok) {
      setInputError(parsed.error);
      const snapshot = currentSnapshot;
      if (snapshot) {
        loadSteps([makeInputErrorStep(parsed.error, snapshot)]);
      }
      return;
    }

    setInputError(null);
    setFormInput(parsed.value);
  };

  const resetInput = () => {
    const initial = adapter.createDefaultInput();
    setFormInput(initial);
    setTextInput(adapter.serializeInput(initial));
    loadSteps([]);
  };

  const summary = useMemo(() => {
    if (!currentSnapshot) {
      return {};
    }
    return adapter.getSnapshotSummary(currentSnapshot);
  }, [adapter, currentSnapshot]);

  const visibleFields = useMemo(
    () =>
      adapter.inputFields.filter((field) => {
        if (!field.visible) {
          return true;
        }
        return field.visible(formInput);
      }),
    [adapter.inputFields, formInput],
  );

  const groupedFields = useMemo(() => {
    const groups: Array<{ name: string; fields: typeof visibleFields }> = [];
    for (const field of visibleFields) {
      const groupName = field.group ?? "기본";
      const target = groups.find((group) => group.name === groupName);
      if (target) {
        target.fields.push(field);
      } else {
        groups.push({ name: groupName, fields: [field] });
      }
    }
    return groups;
  }, [visibleFields]);

  const rendererExtras: Record<string, unknown> = {
    currentStep,
    currentIndex,
    steps,
  };

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-900 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{adapter.title}</h1>
          <Link href={homeHref} className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">
            홈으로
          </Link>
        </div>

        {adapter.description ? (
          <p className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">{adapter.description}</p>
        ) : null}

        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setInputMode("form")}
              className={`rounded-md px-3 py-1.5 text-sm ${
                inputMode === "form" ? "bg-blue-600 text-white" : "border border-zinc-300 bg-white"
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setInputMode("text")}
              className={`rounded-md px-3 py-1.5 text-sm ${
                inputMode === "text" ? "bg-blue-600 text-white" : "border border-zinc-300 bg-white"
              }`}
            >
              Text
            </button>
          </div>

          {inputMode === "form" ? (
            <div className="flex flex-col gap-4">
              {groupedFields.map((group) => (
                <section key={group.name} className="rounded-lg border border-zinc-200 p-3">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-800">{group.name}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.fields.map((field) => (
                      <label key={field.key} className="flex flex-col gap-1 text-sm">
                        <span className="font-medium text-zinc-700">{field.label}</span>
                        {field.type === "textarea" ? (
                          <textarea
                            rows={3}
                            value={formInput[field.key] ?? ""}
                            placeholder={field.placeholder}
                            onChange={(event) => {
                        const next = {
                          ...formInput,
                          [field.key]: event.target.value,
                        };
                        updateFormInput(next);
                      }}
                      className="rounded-md border border-zinc-300 px-3 py-2"
                    />
                        ) : field.type === "select" ? (
                          <select
                            value={formInput[field.key] ?? ""}
                            onChange={(event) => {
                              const next = {
                                ...formInput,
                                [field.key]: event.target.value,
                              };
                              updateFormInput(next);
                            }}
                            className="rounded-md border border-zinc-300 px-3 py-2"
                          >
                            {(field.options ?? []).map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type === "number" ? "number" : "text"}
                            value={formInput[field.key] ?? ""}
                            placeholder={field.placeholder}
                            onChange={(event) => {
                              const next = {
                                ...formInput,
                                [field.key]: event.target.value,
                              };
                              updateFormInput(next);
                            }}
                            className="rounded-md border border-zinc-300 px-3 py-2"
                          />
                        )}
                        {field.helperText ? (
                          <span className="text-xs text-zinc-500">{field.helperText}</span>
                        ) : null}
                      </label>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea
                rows={10}
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm"
              />
              <button
                type="button"
                onClick={applyTextToForm}
                className="w-fit rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
              >
                Text를 Form에 반영
              </button>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={runTrace} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Execute
            </button>
            <button type="button" onClick={resetInput} className="rounded-md bg-zinc-700 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800">
              Reset
            </button>
            <select
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          {inputError ? <p className="mt-3 text-sm text-red-600">{inputError}</p> : null}
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs text-zinc-500">Current Step</p>
            <p className="mt-1 text-lg font-semibold">
              {steps.length === 0 ? "-" : `${currentIndex + 1} / ${steps.length}`}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs text-zinc-500">Phase</p>
            <p className="mt-1 text-lg font-semibold">{currentStep?.phase ?? "-"}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs text-zinc-500">Time Complexity</p>
            <p className="mt-1 text-lg font-semibold">{currentStep?.complexity.timeWorst ?? "-"}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs text-zinc-500">Space Complexity</p>
            <p className="mt-1 text-lg font-semibold">{currentStep?.complexity.spaceWorst ?? "-"}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs text-zinc-500">State</p>
            <p className="mt-1 text-sm">
              {Object.entries(summary)
                .map(([key, value]) => `${key}=${String(value)}`)
                .join(", ") || "-"}
            </p>
          </div>
        </section>

        <Renderer
          snapshot={currentSnapshot}
          {...rendererExtras}
        />

        <section className="flex flex-wrap gap-2 rounded-xl border border-zinc-200 bg-white p-4">
          <button type="button" onClick={prev} className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50">
            Prev
          </button>
          <button type="button" onClick={next} className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50">
            Next
          </button>
          <button
            type="button"
            onClick={isPlaying ? pause : play}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={reset} className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50">
            Reset Step
          </button>

          <input
            type="range"
            min={0}
            max={Math.max(steps.length - 1, 0)}
            value={currentIndex}
            onChange={(event) => jumpTo(Number(event.target.value))}
            className="ml-auto w-48"
          />
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm font-semibold">Step Description</p>
          <p className={`mt-2 text-sm ${currentStep?.isError ? "text-red-600" : "text-zinc-700"}`}>
            {currentStep
              ? `${currentStep.title}: ${currentStep.description}`
              : "입력을 설정하고 Execute를 누르면 trace가 표시됩니다."}
          </p>
        </section>
      </div>
    </div>
  );
}
