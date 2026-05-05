// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { BacktrackingCanvas } from "./backtracking-canvas";
import type { BacktrackingSnapshot } from "@/features/problem/backtracking/types";
import type { TraceStep } from "@/features/trace/types";

function createSnapshot(overrides: Partial<BacktrackingSnapshot> = {}): BacktrackingSnapshot {
  return {
    depth: 1,
    partial: [1],
    currentChoice: 3,
    candidates: [2, 3, 4],
    detailMode: "summary",
    solutions: [[1, 2]],
    stepsEmitted: 3,
    visitedNodes: 4,
    pruned: 1,
    stoppedBy: "none",
    message: "가지치기 후보를 표시합니다.",
    ...overrides,
  };
}

function createStep(snapshot: BacktrackingSnapshot): TraceStep<BacktrackingSnapshot> {
  return {
    id: "bt-step-1",
    title: "가지치기",
    description: "후보를 제거합니다.",
    phase: "prune",
    snapshot,
    complexity: {
      timeWorst: "O(b^d)",
      spaceWorst: "O(d)",
    },
  };
}

describe("BacktrackingCanvas", () => {
  test("snapshot이 없으면 empty 상태를 렌더링한다", () => {
    render(<BacktrackingCanvas snapshot={null} />);

    expect(screen.getByText("입력을 설정하고 Execute를 눌러주세요.")).toBeInTheDocument();
  });

  test("트리 요약, depth lane, 현재 phase 정보를 함께 렌더링한다", () => {
    const snapshot = createSnapshot();
    const currentStep = createStep(snapshot);
    const { container } = render(
      <BacktrackingCanvas
        snapshot={snapshot}
        currentStep={currentStep}
        currentIndex={0}
        steps={[currentStep]}
      />,
    );

    expect(screen.getByText("Backtracking Tree")).toBeInTheDocument();
    expect(screen.getByText("가지치기 후보를 표시합니다.")).toBeInTheDocument();
    expect(screen.getByText("phase:")).toBeInTheDocument();
    expect(screen.getAllByText("prune").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/nodes:/)).toBeInTheDocument();
    expect(screen.getByText(/depth: 1, currentChoice: 3/)).toBeInTheDocument();
    expect(screen.getByText("Depth Lane")).toBeInTheDocument();
    expect(screen.getByText("depth 1")).toBeInTheDocument();
    expect(screen.getAllByText("choice: -").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("solution(exit)")).toBeInTheDocument();
    expect(screen.getByText("current path")).toBeInTheDocument();
    expect(screen.getByText("색상: prune(빨강), solution(exit, 초록), 현재 경로(파랑)")).toBeInTheDocument();

    expect(container.querySelectorAll("circle").length).toBeGreaterThanOrEqual(2);
    expect(container.querySelectorAll("line").length).toBeGreaterThanOrEqual(1);
  });
});
