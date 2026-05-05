// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { GridDfsCanvas } from "./canvas";
import type { GridDfsSnapshot } from "./adapter";

function createSnapshot(overrides: Partial<GridDfsSnapshot> = {}): GridDfsSnapshot {
  return {
    rows: 2,
    cols: 3,
    start: { row: 0, col: 0 },
    goal: { row: 0, col: 2 },
    walls: [{ row: 1, col: 0 }],
    matrixValues: [
      [1, 2, 3],
      [4, 5, 6],
    ],
    showCellValues: true,
    visited: [{ row: 1, col: 0 }, { row: 1, col: 2 }],
    frontier: [{ row: 0, col: 1 }, { row: 1, col: 1 }],
    current: { row: 0, col: 1 },
    path: [{ row: 0, col: 2 }],
    expanded: 4,
    stackSize: 2,
    message: "DFS 경로를 복원했습니다.",
    ...overrides,
  };
}

describe("GridDfsCanvas", () => {
  test("snapshot이 없으면 안내 empty 상태를 렌더링한다", () => {
    render(<GridDfsCanvas snapshot={null} />);

    expect(screen.getByText("입력을 설정하고 Execute를 눌러주세요.")).toBeInTheDocument();
  });

  test("셀 상태와 DFS 전용 범례를 렌더링한다", () => {
    const { container } = render(<GridDfsCanvas snapshot={createSnapshot()} />);

    expect(screen.getByText("Grid DFS Canvas")).toBeInTheDocument();
    expect(screen.getByText("DFS 경로를 복원했습니다.")).toBeInTheDocument();
    expect(screen.getByText("rows=2, cols=3, frontier=2, visited=2")).toBeInTheDocument();
    expect(screen.getByText("frontier(stack)")).toBeInTheDocument();
    expect(screen.getByText("복원 경로")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("G")).toBeInTheDocument();

    expect(container.querySelector('rect[data-state="start"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="current"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="path"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="wall"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="frontier"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="visited"]')).toBeInTheDocument();
  });
});
