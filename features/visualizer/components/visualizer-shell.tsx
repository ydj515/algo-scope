"use client";

import Link from "next/link";
import { useMemo, useState, type ComponentType } from "react";
import type { DsAdapter } from "@/features/visualizer/adapter";
import { useStepper } from "@/features/visualizer/use-stepper";
import type { ListSnapshot, Step } from "@/features/visualizer/types";

type RendererProps<TSnapshot extends ListSnapshot> = {
  snapshot: TSnapshot | null;
};

type Props<TSnapshot extends ListSnapshot, TOperation extends string> = {
  adapter: DsAdapter<TSnapshot, TOperation>;
  Renderer: ComponentType<RendererProps<TSnapshot>>;
  homeHref?: string;
};

function makeValidationErrorStep<TSnapshot extends ListSnapshot>(
  message: string,
  state: TSnapshot,
): Step {
  return {
    id: "validation-error",
    title: "입력 오류",
    description: message,
    snapshot: {
      ...state,
      highlights: undefined,
      message,
    },
    complexity: {
      timeWorst: "-",
      spaceWorst: "-",
    },
    isError: true,
  };
}

export function VisualizerShell<
  TSnapshot extends ListSnapshot,
  TOperation extends string,
>({ adapter, Renderer, homeHref = "/" }: Props<TSnapshot, TOperation>) {
  const [state, setState] = useState<TSnapshot>(adapter.createInitialState());
  const [operation, setOperation] = useState<TOperation>(adapter.operations[0].key);
  const [valueInput, setValueInput] = useState("");

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
  } = useStepper([]);

  const currentSnapshot = (currentStep?.snapshot as TSnapshot | undefined) ?? state;

  const operationConfig = useMemo(
    () => adapter.operations.find((candidate) => candidate.key === operation),
    [adapter.operations, operation],
  );

  const requiresValue = operationConfig?.requiresValue ?? false;
  const inputPlaceholder = operationConfig?.inputPlaceholder ?? "숫자 값";

  const runOperation = () => {
    const parsedValue = Number(valueInput);

    if (requiresValue && (valueInput.trim() === "" || Number.isNaN(parsedValue))) {
      loadSteps([makeValidationErrorStep("숫자 값을 입력해주세요.", state)]);
      return;
    }

    const result = adapter.executeOperation(
      state,
      operation,
      Number.isNaN(parsedValue) ? 0 : parsedValue,
    );

    setState(result.finalState as TSnapshot);
    loadSteps(result.steps, result.steps.length - 1);
  };

  const runRandomInit = () => {
    if (!adapter.randomInit) {
      return;
    }

    const count = Math.floor(Math.random() * 4) + 3;
    const result = adapter.randomInit(count);
    setState(result.finalState as TSnapshot);
    loadSteps(result.steps);
    setValueInput("");
  };

  const runResetAll = () => {
    setState(adapter.createInitialState());
    loadSteps([]);
    setValueInput("");
  };

  const stateSummary = adapter.getStateSummary(currentSnapshot);

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

        <section className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
          <select
            value={operation}
            onChange={(event) => setOperation(event.target.value as TOperation)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            {adapter.operations.map((candidate) => (
              <option key={candidate.key} value={candidate.key}>
                {candidate.label}
              </option>
            ))}
          </select>

          <input
            value={valueInput}
            onChange={(event) => setValueInput(event.target.value)}
            placeholder={requiresValue ? inputPlaceholder : "값 불필요"}
            disabled={!requiresValue}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm disabled:bg-zinc-100"
          />

          <button
            type="button"
            onClick={runOperation}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Execute
          </button>

          <button
            type="button"
            onClick={runRandomInit}
            disabled={!adapter.randomInit}
            className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            Random Init
          </button>

          <button
            type="button"
            onClick={runResetAll}
            className="rounded-md bg-zinc-700 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
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
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs text-zinc-500">Current Step</p>
            <p className="mt-1 text-lg font-semibold">
              {steps.length === 0 ? "-" : `${currentIndex + 1} / ${steps.length}`}
            </p>
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
              {Object.entries(stateSummary)
                .map(([key, value]) => `${key}=${String(value)}`)
                .join(", ")}
            </p>
          </div>
        </section>

        <Renderer snapshot={currentSnapshot} />

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
              : "연산을 실행하면 단계 설명이 표시됩니다."}
          </p>
        </section>
      </div>
    </div>
  );
}
