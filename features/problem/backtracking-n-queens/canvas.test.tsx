// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { NQueensCanvas } from "./canvas";
import type { BacktrackingSnapshot } from "@/features/problem/backtracking/types";

function createSnapshot(overrides: Partial<BacktrackingSnapshot> = {}): BacktrackingSnapshot {
  return {
    depth: 2,
    partial: [1, 3],
    currentChoice: null,
    candidates: [],
    detailMode: "summary",
    solutions: [[1, 3, 0, 2]],
    stepsEmitted: 4,
    visitedNodes: 6,
    pruned: 2,
    stoppedBy: "none",
    boardSize: 4,
    queenCols: [1, 3],
    message: "현재 배치",
    ...overrides,
  };
}

describe("NQueensCanvas", () => {
  test("board 정보가 없으면 empty 상태를 렌더링한다", () => {
    render(<NQueensCanvas snapshot={null} />);

    expect(screen.getByText("입력을 설정하고 Execute를 눌러주세요.")).toBeInTheDocument();
  });

  test("체스판 메타와 배치된 퀸을 렌더링한다", () => {
    const { container } = render(<NQueensCanvas snapshot={createSnapshot()} />);

    expect(screen.getByText("N-Queens Board")).toBeInTheDocument();
    expect(screen.getByText("n=4, placed=2")).toBeInTheDocument();
    expect(screen.getByText("현재 배치: [1, 3]")).toBeInTheDocument();
    expect(screen.getAllByText("Q")).toHaveLength(2);
    expect(container.querySelectorAll("rect")).toHaveLength(16);
  });
});
