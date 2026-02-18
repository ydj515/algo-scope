"use client";

import { gridDfsAdapter } from "@/features/problem/grid-dfs/adapter";
import { GridDfsCanvas } from "@/features/problem/grid-dfs/canvas";
import { TraceShell } from "@/features/trace/components/trace-shell";

export default function GridDfsPage() {
  return <TraceShell adapter={gridDfsAdapter} Renderer={GridDfsCanvas} homeHref="/problems" />;
}
