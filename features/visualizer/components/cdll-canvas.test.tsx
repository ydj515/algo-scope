// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CdllCanvas } from "./cdll-canvas";
import type { ListSnapshot } from "@/features/visualizer/types";

function createSnapshot(overrides: Partial<ListSnapshot> = {}): ListSnapshot {
  return {
    nodes: {
      1: { id: 1, value: 10, prevId: 2, nextId: 2 },
      2: { id: 2, value: 20, prevId: 1, nextId: 1 },
    },
    order: [1, 2],
    headId: 1,
    tailId: 2,
    size: 2,
    nextId: 3,
    highlights: {
      nodeIds: [2],
    },
    ...overrides,
  };
}

describe("CdllCanvas", () => {
  test("비어 있는 리스트는 empty 상태를 렌더링한다", () => {
    render(<CdllCanvas snapshot={null} />);

    expect(screen.getByText("리스트가 비어 있습니다.")).toBeInTheDocument();
  });

  test("노드, 방향 간선, HEAD/TAIL 배지를 렌더링한다", () => {
    const { container } = render(<CdllCanvas snapshot={createSnapshot()} />);

    expect(screen.getByText("HEAD")).toBeInTheDocument();
    expect(screen.getByText("TAIL")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(container.querySelectorAll("circle")).toHaveLength(2);
    expect(container.querySelectorAll("line")).toHaveLength(4);
    expect(container.querySelector('circle[stroke-width="3"]')).toBeInTheDocument();
  });
});
