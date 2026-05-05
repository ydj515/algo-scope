// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { GridBfsCanvas } from "./canvas";
import type { GridBfsSnapshot } from "./adapter";

function createSnapshot(overrides: Partial<GridBfsSnapshot> = {}): GridBfsSnapshot {
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
    queueSize: 2,
    message: "경로를 복원했습니다.",
    ...overrides,
  };
}

describe("GridBfsCanvas", () => {
  test("snapshot이 없으면 안내 empty 상태를 렌더링한다", () => {
    render(<GridBfsCanvas snapshot={null} />);

    expect(screen.getByText("입력을 설정하고 Execute를 눌러주세요.")).toBeInTheDocument();
  });

  test("셀 상태 우선순위와 보조 정보를 함께 렌더링한다", () => {
    const { container } = render(<GridBfsCanvas snapshot={createSnapshot()} />);

    expect(screen.getByText("Grid BFS Canvas")).toBeInTheDocument();
    expect(screen.getByText("경로를 복원했습니다.")).toBeInTheDocument();
    expect(screen.getByText("rows=2, cols=3, frontier=2, visited=2")).toBeInTheDocument();
    expect(screen.getByText("frontier")).toBeInTheDocument();
    expect(screen.getByText("최종 경로")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("G")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();

    expect(container.querySelector('rect[data-state="start"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="current"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="path"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="wall"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="frontier"]')).toBeInTheDocument();
    expect(container.querySelector('rect[data-state="visited"]')).toBeInTheDocument();
  });
});
