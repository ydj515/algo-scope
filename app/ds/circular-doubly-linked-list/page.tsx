"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  createEmptyListState,
  insertHead,
  insertTail,
  randomInit,
  removeHead,
  removeTail,
  searchValue,
} from "@/features/ds/cdll/operations";
import { CdllCanvas } from "@/features/visualizer/components/cdll-canvas";
import { useStepper } from "@/features/visualizer/use-stepper";
import type { ListSnapshot, Step } from "@/features/visualizer/types";

type OperationType =
  | "insertHead"
  | "insertTail"
  | "removeHead"
  | "removeTail"
  | "searchValue";

function makeErrorStep(message: string, state: ListSnapshot): Step {
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

export default function CircularDoublyLinkedListPage() {
  const [listState, setListState] = useState<ListSnapshot>(createEmptyListState());
  const [operation, setOperation] = useState<OperationType>("insertHead");
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

  const currentSnapshot = currentStep?.snapshot ?? listState;

  const requiresValue = useMemo(
    () => operation === "insertHead" || operation === "insertTail" || operation === "searchValue",
    [operation],
  );

  const runOperation = () => {
    const parsedValue = Number(valueInput);

    if (requiresValue && (valueInput.trim() === "" || Number.isNaN(parsedValue))) {
      loadSteps([makeErrorStep("숫자 값을 입력해주세요.", listState)]);
      return;
    }

    const result =
      operation === "insertHead"
        ? insertHead(listState, parsedValue)
        : operation === "insertTail"
          ? insertTail(listState, parsedValue)
          : operation === "removeHead"
            ? removeHead(listState)
            : operation === "removeTail"
              ? removeTail(listState)
              : searchValue(listState, parsedValue);

    setListState(result.finalState);
    loadSteps(result.steps, result.steps.length - 1);
  };

  const runRandomInit = () => {
    const count = Math.floor(Math.random() * 4) + 3;
    const result = randomInit(count);
    setListState(result.finalState);
    loadSteps(result.steps);
    setValueInput("");
  };

  const runReset = () => {
    const empty = createEmptyListState();
    setListState(empty);
    loadSteps([]);
  };

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-900 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Circular Doubly Linked List Visualizer</h1>
          <Link href="/" className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">
            홈으로
          </Link>
        </div>

        <section className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
          <select
            value={operation}
            onChange={(event) => setOperation(event.target.value as OperationType)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="insertHead">Insert at Head</option>
            <option value="insertTail">Insert at Tail</option>
            <option value="removeHead">Remove at Head</option>
            <option value="removeTail">Remove at Tail</option>
            <option value="searchValue">Search by Value</option>
          </select>

          <input
            value={valueInput}
            onChange={(event) => setValueInput(event.target.value)}
            placeholder={requiresValue ? "숫자 값" : "값 불필요"}
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
            className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Random Init
          </button>

          <button
            type="button"
            onClick={runReset}
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
              size={currentSnapshot.size}, head={String(currentSnapshot.headId)}, tail={String(currentSnapshot.tailId)}
            </p>
          </div>
        </section>

        <CdllCanvas snapshot={currentSnapshot} />

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
            {currentStep ? `${currentStep.title}: ${currentStep.description}` : "연산을 실행하면 단계 설명이 표시됩니다."}
          </p>
        </section>
      </div>
    </div>
  );
}
