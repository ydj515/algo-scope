// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TreeCanvas } from "./tree-canvas";
import type { ListSnapshot } from "@/features/visualizer/types";

function createSnapshot(overrides: Partial<ListSnapshot> = {}): ListSnapshot {
  return {
    nodes: {
      1: { id: 1, value: 10, prevId: 2, nextId: 3 },
      2: { id: 2, value: 5, prevId: 2, nextId: 2 },
      3: { id: 3, value: 14, prevId: 3, nextId: 3 },
    },
    order: [1, 2, 3],
    headId: 1,
    tailId: null,
    size: 3,
    nextId: 4,
    highlights: {
      nodeIds: [3],
    },
    ...overrides,
  };
}

describe("TreeCanvas", () => {
  test("비어 있는 트리는 empty 상태를 렌더링한다", () => {
    render(<TreeCanvas snapshot={null} />);

    expect(screen.getByText("트리가 비어 있습니다.")).toBeInTheDocument();
  });

  test("ROOT 라벨과 간선/강조 노드를 렌더링한다", () => {
    const { container } = render(<TreeCanvas snapshot={createSnapshot()} />);

    expect(screen.getByText("ROOT")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(container.querySelectorAll("circle")).toHaveLength(3);
    expect(container.querySelectorAll("line")).toHaveLength(2);
    expect(container.querySelector('circle[stroke-width="3"]')).toBeInTheDocument();
  });
});
