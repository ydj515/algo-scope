// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { QueueCanvas } from "./queue-canvas";
import type { ListSnapshot } from "@/features/visualizer/types";

function createSnapshot(overrides: Partial<ListSnapshot> = {}): ListSnapshot {
  return {
    nodes: {
      1: { id: 1, value: 10, prevId: 1, nextId: 2 },
      2: { id: 2, value: 20, prevId: 1, nextId: 3 },
      3: { id: 3, value: 30, prevId: 2, nextId: 3 },
    },
    order: [1, 2, 3],
    headId: 1,
    tailId: 3,
    size: 3,
    nextId: 4,
    highlights: {
      nodeIds: [2],
    },
    ...overrides,
  };
}

describe("QueueCanvas", () => {
  test("비어 있는 큐는 empty 상태를 렌더링한다", () => {
    render(<QueueCanvas snapshot={null} />);

    expect(screen.getByText("큐가 비어 있습니다.")).toBeInTheDocument();
  });

  test("FRONT/REAR 라벨과 강조 노드를 렌더링한다", () => {
    const { container } = render(<QueueCanvas snapshot={createSnapshot()} />);

    expect(screen.getByText("FRONT")).toBeInTheDocument();
    expect(screen.getByText("REAR")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(container.querySelectorAll("rect")).toHaveLength(3);
    expect(container.querySelectorAll("text")).toHaveLength(7);
    expect(container.querySelector('rect[stroke-width="3"]')).toBeInTheDocument();
  });
});
