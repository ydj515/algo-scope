// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { StackCanvas } from "./stack-canvas";
import type { ListSnapshot } from "@/features/visualizer/types";

function createSnapshot(overrides: Partial<ListSnapshot> = {}): ListSnapshot {
  return {
    nodes: {
      1: { id: 1, value: 30, prevId: 1, nextId: 2 },
      2: { id: 2, value: 20, prevId: 2, nextId: 3 },
      3: { id: 3, value: 10, prevId: 3, nextId: 3 },
    },
    order: [1, 2, 3],
    headId: 1,
    tailId: 3,
    size: 3,
    nextId: 4,
    highlights: {
      nodeIds: [1],
    },
    ...overrides,
  };
}

describe("StackCanvas", () => {
  test("비어 있는 스택은 empty 상태를 렌더링한다", () => {
    render(<StackCanvas snapshot={null} />);

    expect(screen.getByText("스택이 비어 있습니다.")).toBeInTheDocument();
  });

  test("TOP/BOTTOM 라벨과 강조 노드를 렌더링한다", () => {
    const { container } = render(<StackCanvas snapshot={createSnapshot()} />);

    expect(screen.getByText("TOP")).toBeInTheDocument();
    expect(screen.getByText("BOTTOM")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(container.querySelectorAll("rect")).toHaveLength(3);
    expect(container.querySelector('rect[stroke-width="3"]')).toBeInTheDocument();
  });
});
