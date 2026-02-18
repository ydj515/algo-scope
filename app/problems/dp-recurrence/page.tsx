"use client";

import { DpTableCanvas } from "@/features/problem/dp/components/dp-table-canvas";
import { dpRecurrenceAdapter } from "@/features/problem/dp-recurrence/adapter";
import { TraceShell } from "@/features/trace/components/trace-shell";

export default function DpRecurrencePage() {
  return <TraceShell adapter={dpRecurrenceAdapter} Renderer={DpTableCanvas} homeHref="/problems" />;
}
