"use client";

import { backtrackingNQueensAdapter } from "@/features/problem/backtracking-n-queens/adapter";
import { NQueensCanvas } from "@/features/problem/backtracking-n-queens/canvas";
import { TraceShell } from "@/features/trace/components/trace-shell";

export default function BacktrackingNQueensPage() {
  return <TraceShell adapter={backtrackingNQueensAdapter} Renderer={NQueensCanvas} homeHref="/" />;
}
