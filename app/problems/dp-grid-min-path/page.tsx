"use client";

import { DpTableCanvas } from "@/features/problem/dp/components/dp-table-canvas";
import { dpGridMinPathAdapter } from "@/features/problem/dp-grid-min-path/adapter";
import { TraceShell } from "@/features/trace/components/trace-shell";

export default function DpGridMinPathPage() {
  return <TraceShell adapter={dpGridMinPathAdapter} Renderer={DpTableCanvas} homeHref="/" />;
}
