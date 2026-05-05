// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { TraceShell } from "./trace-shell";
import type { ProblemTraceAdapter } from "@/features/trace/adapter";
import type { TraceResult, TraceStep } from "@/features/trace/types";

type TraceInput = {
  count: string;
};

type TraceSnapshot = {
  count: number;
  message: string;
};

function createTraceStep(
  id: string,
  title: string,
  description: string,
  snapshot: TraceSnapshot,
  phase: TraceStep<TraceSnapshot>["phase"] = "update",
): TraceStep<TraceSnapshot> {
  return {
    id,
    title,
    description,
    phase,
    snapshot,
    complexity: {
      timeWorst: "O(1)",
      spaceWorst: "O(1)",
    },
  };
}

function createAdapter(
  run: ProblemTraceAdapter<TraceInput, TraceSnapshot>["run"],
  parseInputText: ProblemTraceAdapter<TraceInput, TraceSnapshot>["parseInputText"],
): ProblemTraceAdapter<TraceInput, TraceSnapshot> {
  return {
    id: "mock-trace",
    title: "Mock Trace",
    description: "공통 TraceShell 테스트",
    inputFields: [
      {
        key: "count",
        label: "count",
        type: "number",
        placeholder: "횟수 입력",
      },
    ],
    createDefaultInput: () => ({
      count: "1",
    }),
    serializeInput: (input) => JSON.stringify(input, null, 2),
    parseInputText,
    run,
    getSnapshotSummary: (snapshot) => ({
      count: snapshot.count,
      message: snapshot.message,
    }),
  };
}

function MockRenderer({ snapshot }: { snapshot: TraceSnapshot | null }) {
  return <div>Renderer:{snapshot?.message ?? "none"}:{snapshot?.count ?? -1}</div>;
}

describe("TraceShell", () => {
  test("form 모드 실행 시 마지막 trace step을 렌더링한다", async () => {
    const run = vi.fn<(input: TraceInput) => TraceResult<TraceSnapshot>>((input) => ({
      steps: [
        createTraceStep("trace-1", "준비", "입력 확인", { count: Number(input.count), message: "mid" }, "enter"),
        createTraceStep("trace-2", "완료", "실행 완료", { count: Number(input.count), message: "done" }, "exit"),
      ],
      finalSnapshot: { count: Number(input.count), message: "done" },
    }));
    const parseInputText = vi.fn((text: string) => ({
      ok: true as const,
      value: JSON.parse(text) as TraceInput,
    }));
    const adapter = createAdapter(run, parseInputText);
    const user = userEvent.setup();

    render(<TraceShell adapter={adapter} Renderer={MockRenderer} />);

    await user.clear(screen.getByRole("spinbutton"));
    await user.type(screen.getByRole("spinbutton"), "3");
    await user.click(screen.getByRole("button", { name: "Execute" }));

    expect(run).toHaveBeenCalledWith({ count: "3" });
    expect(screen.getByText("Renderer:done:3")).toBeInTheDocument();
    expect(screen.getByText("완료: 실행 완료")).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(screen.getByText("count=3, message=done")).toBeInTheDocument();
  });

  test("text 모드에서 Form 반영 후 실행하면 파싱된 입력으로 동작한다", async () => {
    const run = vi.fn<(input: TraceInput) => TraceResult<TraceSnapshot>>((input) => ({
      steps: [
        createTraceStep("trace-1", "완료", "텍스트 입력 반영", { count: Number(input.count), message: "text-run" }, "exit"),
      ],
      finalSnapshot: { count: Number(input.count), message: "text-run" },
    }));
    const parseInputText = vi.fn((text: string) => {
      try {
        return {
          ok: true as const,
          value: JSON.parse(text) as TraceInput,
        };
      } catch {
        return {
          ok: false as const,
          error: "잘못된 입력",
        };
      }
    });
    const adapter = createAdapter(run, parseInputText);
    const user = userEvent.setup();

    render(<TraceShell adapter={adapter} Renderer={MockRenderer} />);

    await user.click(screen.getByRole("button", { name: "Text" }));
    const textbox = screen.getByRole("textbox");
    await user.clear(textbox);
    await user.click(textbox);
    await user.paste('{"count":"5"}');
    await user.click(screen.getByRole("button", { name: "Text를 Form에 반영" }));
    await user.click(screen.getByRole("button", { name: "Form" }));

    expect(screen.getByRole("spinbutton")).toHaveValue(5);

    await user.click(screen.getByRole("button", { name: "Execute" }));

    expect(run).toHaveBeenCalledWith({ count: "5" });
    expect(screen.getByText("Renderer:text-run:5")).toBeInTheDocument();
  });

  test("text 모드 파싱 오류는 에러를 노출하고 run을 호출하지 않는다", async () => {
    const run = vi.fn<(input: TraceInput) => TraceResult<TraceSnapshot>>();
    const parseInputText = vi.fn(() => ({
      ok: false as const,
      error: "잘못된 입력",
    }));
    const adapter = createAdapter(run, parseInputText);
    const user = userEvent.setup();

    render(<TraceShell adapter={adapter} Renderer={MockRenderer} />);

    await user.click(screen.getByRole("button", { name: "Text" }));
    const textbox = screen.getByRole("textbox");
    await user.clear(textbox);
    await user.click(textbox);
    await user.paste("invalid");
    await user.click(screen.getByRole("button", { name: "Execute" }));

    expect(run).not.toHaveBeenCalled();
    expect(screen.getByText("잘못된 입력")).toBeInTheDocument();
    expect(screen.getByText("Renderer:none:-1")).toBeInTheDocument();
  });
});
