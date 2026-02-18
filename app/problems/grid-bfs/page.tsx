"use client";

import { gridBfsAdapter } from "@/features/problem/grid-bfs/adapter";
import { GridBfsCanvas } from "@/features/problem/grid-bfs/canvas";
import { TraceShell } from "@/features/trace/components/trace-shell";

export default function GridBfsPage() {
  return <TraceShell adapter={gridBfsAdapter} Renderer={GridBfsCanvas} homeHref="/problems" />;
}
