"use client";

import { DpTableCanvas } from "@/features/problem/dp/components/dp-table-canvas";
import { dpKnapsackAdapter } from "@/features/problem/dp-knapsack/adapter";
import { TraceShell } from "@/features/trace/components/trace-shell";

export default function DpKnapsackPage() {
  return <TraceShell adapter={dpKnapsackAdapter} Renderer={DpTableCanvas} homeHref="/problems" />;
}
