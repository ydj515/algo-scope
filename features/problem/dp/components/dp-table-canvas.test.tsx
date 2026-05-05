// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DpTableCanvas } from "./dp-table-canvas";
import type { DpSnapshot } from "@/features/problem/dp/types";

function createSnapshot(overrides: Partial<DpSnapshot> = {}): DpSnapshot {
  return {
    rows: 2,
    cols: 2,
    table: [
      [1, 4],
      [2, 7],
    ],
    focus: { row: 0, col: 1 },
    changedCells: [{ row: 0, col: 1 }, { row: 1, col: 0 }],
    reconstructedPath: [{ row: 0, col: 0 }, { row: 0, col: 1 }],
    answer: 7,
    showPath: true,
    message: "최소 비용 경로를 복원했습니다.",
    meta: { mode: "summary" },
    ...overrides,
  };
}

describe("DpTableCanvas", () => {
  test("snapshot이 없으면 empty 상태를 렌더링한다", () => {
    render(<DpTableCanvas snapshot={null} />);

    expect(screen.getByText("입력을 설정하고 Execute를 눌러주세요.")).toBeInTheDocument();
  });

  test("focus/changed/path 상태와 테이블 메타를 렌더링한다", () => {
    const { container } = render(<DpTableCanvas snapshot={createSnapshot()} />);

    expect(screen.getByText("DP Table Canvas")).toBeInTheDocument();
    expect(screen.getByText("rows=2, cols=2, answer=7")).toBeInTheDocument();
    expect(screen.getByText("최소 비용 경로를 복원했습니다.")).toBeInTheDocument();
    expect(screen.getByText("현재 셀")).toBeInTheDocument();
    expect(screen.getByText("복원 경로")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();

    expect(container.querySelector('rect[data-state="current"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="changed"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="path"]')).toBeInTheDocument();
    expect(container.querySelectorAll("rect.viz-cell")).toHaveLength(4);
  });
});
