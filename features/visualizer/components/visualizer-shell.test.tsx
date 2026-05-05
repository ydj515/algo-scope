// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { VisualizerShell } from "./visualizer-shell";
import type { DsAdapter } from "@/features/visualizer/adapter";
import type { ListSnapshot, OperationResult, Step } from "@/features/visualizer/types";

type Operation = "push" | "clear";

function createSnapshot(overrides: Partial<ListSnapshot> = {}): ListSnapshot {
  return {
    nodes: {},
    order: [],
    headId: null,
    tailId: null,
    size: 0,
    nextId: 1,
    ...overrides,
  };
}

function createStep(id: string, title: string, description: string, snapshot: ListSnapshot): Step {
  return {
    id,
    title,
    description,
    snapshot,
    complexity: {
      timeWorst: "O(1)",
      spaceWorst: "O(1)",
    },
  };
}

function createAdapter(executeOperation: DsAdapter<ListSnapshot, Operation>["executeOperation"]): DsAdapter<ListSnapshot, Operation> {
  return {
    id: "mock-ds",
    title: "Mock Visualizer",
    description: "공통 VisualizerShell 테스트",
    operations: [
      {
        key: "push",
        label: "Push",
        requiresValue: true,
        inputPlaceholder: "숫자 입력",
      },
      {
        key: "clear",
        label: "Clear",
        requiresValue: false,
        inputPlaceholder: "값 불필요",
      },
    ],
    createInitialState: () => createSnapshot(),
    executeOperation,
    getStateSummary: (snapshot) => ({
      size: snapshot.size,
      message: snapshot.message ?? "-",
    }),
  };
}

function MockRenderer({ snapshot }: { snapshot: ListSnapshot | null }) {
  return (
    <div>
      Renderer:{snapshot?.message ?? "none"}:{snapshot?.size ?? -1}
    </div>
  );
}

describe("VisualizerShell", () => {
  test("값이 필요한 연산에서 빈 입력으로 실행하면 검증 오류를 보여준다", async () => {
    const executeOperation = vi.fn<() => OperationResult>();
    const adapter = createAdapter(executeOperation as DsAdapter<ListSnapshot, Operation>["executeOperation"]);
    const user = userEvent.setup();

    render(<VisualizerShell adapter={adapter} Renderer={MockRenderer} />);

    await user.click(screen.getByRole("button", { name: "Execute" }));

    expect(executeOperation).not.toHaveBeenCalled();
    expect(screen.getByText("Renderer:숫자 값을 입력해주세요.:0")).toBeInTheDocument();
    expect(screen.getByText("입력 오류: 숫자 값을 입력해주세요.")).toBeInTheDocument();
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
  });

  test("실행 시 마지막 step snapshot을 렌더러와 요약 카드에 반영한다", async () => {
    const finalSnapshot = createSnapshot({
      size: 1,
      message: "rendered-last",
    });
    const executeOperation = vi.fn<
      DsAdapter<ListSnapshot, Operation>["executeOperation"]
    >((_state, _operation, value) => ({
      steps: [
        createStep("step-1", "준비", `입력 ${value}`, createSnapshot({ message: "intermediate" })),
        createStep("step-2", "완료", `값 ${value} 반영`, finalSnapshot),
      ],
      finalState: finalSnapshot,
    }));
    const adapter = createAdapter(executeOperation);
    const user = userEvent.setup();

    render(<VisualizerShell adapter={adapter} Renderer={MockRenderer} />);

    await user.type(screen.getByPlaceholderText("숫자 입력"), "42");
    await user.click(screen.getByRole("button", { name: "Execute" }));

    expect(executeOperation).toHaveBeenCalledWith(createSnapshot(), "push", 42);
    expect(screen.getByText("Renderer:rendered-last:1")).toBeInTheDocument();
    expect(screen.getByText("완료: 값 42 반영")).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(screen.getByText("size=1, message=rendered-last")).toBeInTheDocument();
  });
});
