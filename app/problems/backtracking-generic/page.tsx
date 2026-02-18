"use client";

import { backtrackingGenericAdapter } from "@/features/problem/backtracking-generic/adapter";
import { BacktrackingCanvas } from "@/features/problem/backtracking/components/backtracking-canvas";
import { TraceShell } from "@/features/trace/components/trace-shell";

export default function BacktrackingGenericPage() {
  return <TraceShell adapter={backtrackingGenericAdapter} Renderer={BacktrackingCanvas} homeHref="/problems" />;
}
