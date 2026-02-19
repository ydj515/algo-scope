"use client";

import { useMemo, useState, type ComponentType } from "react";
import type { ProblemTraceAdapter } from "@/features/trace/adapter";
import type { TraceStep } from "@/features/trace/types";
import { useTraceStepper } from "@/features/trace/use-trace-stepper";
import { Button } from "@/features/ui/components/button";
import { Card } from "@/features/ui/components/card";
import { Badge } from "@/features/ui/components/badge";
import {
  CheckboxField,
  InputField,
  NumberField,
  RangeField,
  SelectField,
  TextareaField,
} from "@/features/ui/components/field";

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
  const visibleSteps = steps.slice(Math.max(0, currentIndex - 4), currentIndex + 1);

  const renderFormField = (field: typeof visibleFields[number]) => {
    const value = formInput[field.key] ?? "";
    const updateValue = (nextValue: string) => {
      const next = {
        ...formInput,
        [field.key]: nextValue,
      };
      updateFormInput(next);
    };

    switch (field.type) {
      case "textarea":
        return (
          <TextareaField
            key={field.key}
            label={field.label}
            helperText={field.helperText}
            rows={3}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => updateValue(event.target.value)}
          />
        );
      case "select":
        return (
          <SelectField
            key={field.key}
            label={field.label}
            helperText={field.helperText}
            value={value}
            options={(field.options ?? []).map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            onChange={(event) => updateValue(event.target.value)}
          />
        );
      case "number":
        return (
          <NumberField
            key={field.key}
            label={field.label}
            helperText={field.helperText}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => updateValue(event.target.value)}
          />
        );
      case "checkbox":
        return (
          <CheckboxField
            key={field.key}
            label={field.label}
            helperText={field.helperText}
            checked={value === "true"}
            onChange={(event) => updateValue(event.target.checked ? "true" : "false")}
          />
        );
      case "text":
      default:
        return (
          <InputField
            key={field.key}
            label={field.label}
            helperText={field.helperText}
            type="text"
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => updateValue(event.target.value)}
          />
        );
    }
  };

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

        <Card className="p-4" motion="slide">
          <div className="mb-3 flex gap-2">
            <Button
              onClick={() => setInputMode("form")}
              variant={inputMode === "form" ? "solid" : "outline"}
              tone={inputMode === "form" ? "primary" : "neutral"}
              size="sm"
            >
              Form
            </Button>
            <Button
              onClick={() => setInputMode("text")}
              variant={inputMode === "text" ? "solid" : "outline"}
              tone={inputMode === "text" ? "primary" : "neutral"}
              size="sm"
            >
              Text
            </Button>
          </div>

          {inputMode === "form" ? (
            <div className="flex flex-col gap-4">
              {groupedFields.map((group) => (
                <Card key={group.name} className="rounded-[var(--radius-md)] p-3">
                  <h3 className="mb-3 text-sm font-semibold text-[var(--color-fg)]">{group.name}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.fields.map((field) => renderFormField(field))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <TextareaField
                rows={10}
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                className="w-full font-mono"
              />
              <Button onClick={applyTextToForm} variant="outline" tone="neutral" className="w-fit">
                Text를 Form에 반영
              </Button>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={runTrace} tone="primary">Execute</Button>
            <Button onClick={resetInput} tone="warning">Reset</Button>
            <SelectField
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              options={[
                { label: "0.5x", value: "0.5" },
                { label: "1x", value: "1" },
                { label: "2x", value: "2" },
              ]}
            />
          </div>

          {inputError ? (
            <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-danger)]/30 bg-[color-mix(in_srgb,var(--color-danger)_10%,var(--color-surface))] px-3 py-2">
              <Badge tone="danger">ERROR</Badge>
              <p className="text-sm text-[var(--color-danger)]">{inputError}</p>
            </div>
          ) : null}
        </Card>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="p-4">
            <p className="text-xs text-[var(--color-fg-muted)]">Current Step</p>
            <p className="mt-1 text-lg font-semibold">
              {steps.length === 0 ? "-" : `${currentIndex + 1} / ${steps.length}`}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-[var(--color-fg-muted)]">Phase</p>
            <p className="mt-1 text-lg font-semibold">{currentStep?.phase ?? "-"}</p>
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
              {Object.entries(summary)
                .map(([key, value]) => `${key}=${String(value)}`)
                .join(", ") || "-"}
            </p>
          </Card>
        </section>

        <Renderer snapshot={currentSnapshot} {...rendererExtras} />

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

          <RangeField
            min={0}
            max={Math.max(steps.length - 1, 0)}
            value={currentIndex}
            onChange={(event) => jumpTo(Number(event.target.value))}
            wrapperClassName="ml-auto w-48"
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
                  idx === visibleSteps.length - 1 ? "bg-[var(--color-surface-muted)]" : ""
                }`}
              >
                <Badge
                  tone={
                    step.isError
                      ? "danger"
                      : step.phase === "exit"
                        ? "success"
                        : step.phase === "prune"
                          ? "warning"
                          : "info"
                  }
                >
                  {step.isError
                    ? "ERROR"
                    : step.phase === "exit"
                      ? "SUCCESS"
                      : step.phase === "prune"
                        ? "WARN"
                        : "INFO"}
                </Badge>
                <span className="truncate text-[var(--color-fg-muted)]">{step.title}</span>
              </div>
            ))}
            {steps.length === 0 ? <p className="text-xs text-[var(--color-fg-muted)]">아직 step이 없습니다.</p> : null}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Step Description</p>
            <Badge
              tone={
                currentStep?.isError
                  ? "danger"
                  : currentStep?.phase === "exit"
                    ? "success"
                    : currentStep?.phase === "prune"
                      ? "warning"
                      : "info"
              }
            >
              {currentStep?.isError
                ? "ERROR"
                : currentStep?.phase === "exit"
                  ? "SUCCESS"
                  : currentStep?.phase === "prune"
                    ? "WARN"
                    : "INFO"}
            </Badge>
          </div>
          <p className={`mt-2 text-sm ${currentStep?.isError ? "text-[var(--color-danger)]" : "text-[var(--color-fg-muted)]"}`}>
            {currentStep
              ? `${currentStep.title}: ${currentStep.description}`
              : "입력을 설정하고 Execute를 누르면 trace가 표시됩니다."}
          </p>
        </Card>
      </div>
    </div>
  );
}
