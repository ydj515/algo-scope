"use client";

import { useMemo, useState, type ComponentType } from "react";
import type { DsAdapter } from "@/features/visualizer/adapter";
import { useStepper } from "@/features/visualizer/use-stepper";
import type { ListSnapshot, Step } from "@/features/visualizer/types";
import { Button } from "@/features/ui/components/button";
import { Card } from "@/features/ui/components/card";
import { Badge } from "@/features/ui/components/badge";
import { InputField, SelectField } from "@/features/ui/components/field";

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
  const visibleSteps = steps.slice(Math.max(0, currentIndex - 4), currentIndex + 1);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 py-8 text-[var(--color-fg)] sm:px-8 motion-fade-in">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{adapter.title}</h1>
          <Button href={homeHref} variant="outline" size="sm" tone="neutral">
            홈으로
          </Button>
        </div>

        {adapter.description ? (
          <Card className="p-4">
            <p className="text-sm text-[var(--color-fg-muted)]">{adapter.description}</p>
          </Card>
        ) : null}

        <Card className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6" motion="slide">
          <SelectField
            value={operation}
            onChange={(event) => setOperation(event.target.value as TOperation)}
            options={adapter.operations.map((candidate) => ({
              label: candidate.label,
              value: candidate.key,
            }))}
            wrapperClassName="sm:col-span-1"
          />

          <InputField
            value={valueInput}
            onChange={(event) => setValueInput(event.target.value)}
            placeholder={requiresValue ? inputPlaceholder : "값 불필요"}
            disabled={!requiresValue}
            wrapperClassName="sm:col-span-1"
            className="disabled:opacity-60"
          />

          <Button onClick={runOperation} tone="primary">Execute</Button>

          <Button onClick={runRandomInit} disabled={!adapter.randomInit} tone="success">
            Random Init
          </Button>

          <Button onClick={runResetAll} tone="warning">Reset</Button>

          <SelectField
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            options={[
              { label: "0.5x", value: "0.5" },
              { label: "1x", value: "1" },
              { label: "2x", value: "2" },
            ]}
            wrapperClassName="sm:col-span-1"
          />
        </Card>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <p className="text-xs text-[var(--color-fg-muted)]">Current Step</p>
            <p className="mt-1 text-lg font-semibold">
              {steps.length === 0 ? "-" : `${currentIndex + 1} / ${steps.length}`}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-[var(--color-fg-muted)]">Time Complexity</p>
            <p className="mt-1 text-lg font-semibold">{currentStep?.complexity.timeWorst ?? "-"}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-[var(--color-fg-muted)]">Space Complexity</p>
            <p className="mt-1 text-lg font-semibold">{currentStep?.complexity.spaceWorst ?? "-"}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-[var(--color-fg-muted)]">State</p>
            <p className="mt-1 text-sm">
              {Object.entries(stateSummary)
                .map(([key, value]) => `${key}=${String(value)}`)
                .join(", ")}
            </p>
          </Card>
        </section>

        <Renderer snapshot={currentSnapshot} />

        <Card className="flex flex-wrap gap-2 p-4">
          <Button onClick={prev} variant="outline" tone="neutral">Prev</Button>
          <Button onClick={next} variant="outline" tone="neutral">Next</Button>
          <Button
            onClick={isPlaying ? pause : play}
            variant="outline"
            tone="neutral"
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button onClick={reset} variant="outline" tone="neutral">Reset Step</Button>

          <input
            type="range"
            min={0}
            max={Math.max(steps.length - 1, 0)}
            value={currentIndex}
            onChange={(event) => jumpTo(Number(event.target.value))}
            className="ml-auto w-48"
          />
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <p className="text-sm font-semibold">Step List</p>
            <Badge tone="neutral" variant="outline">{steps.length} steps</Badge>
          </div>
          <div className="space-y-1">
            {visibleSteps.map((step, idx) => (
              <div
                key={`step-row-${step.id}`}
                className={`flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1 text-xs ${
                  idx === visibleSteps.length - 1
                    ? "bg-[var(--color-surface-muted)]"
                    : ""
                }`}
              >
                <Badge tone={step.isError ? "danger" : "info"}>{step.isError ? "ERROR" : "STEP"}</Badge>
                <span className="truncate text-[var(--color-fg-muted)]">
                  {step.title}
                </span>
              </div>
            ))}
            {steps.length === 0 ? <p className="text-xs text-[var(--color-fg-muted)]">아직 step이 없습니다.</p> : null}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Step Description</p>
            <Badge tone={currentStep?.isError ? "danger" : "info"}>
              {currentStep?.isError ? "ERROR" : "INFO"}
            </Badge>
          </div>
          <p className={`mt-2 text-sm ${currentStep?.isError ? "text-[var(--color-danger)]" : "text-[var(--color-fg-muted)]"}`}>
            {currentStep
              ? `${currentStep.title}: ${currentStep.description}`
              : "연산을 실행하면 단계 설명이 표시됩니다."}
          </p>
        </Card>
      </div>
    </div>
  );
}
