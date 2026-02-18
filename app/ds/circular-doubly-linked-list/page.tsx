"use client";

import { cdllAdapter } from "@/features/ds/cdll/adapter";
import { CdllCanvas } from "@/features/visualizer/components/cdll-canvas";
import { VisualizerShell } from "@/features/visualizer/components/visualizer-shell";

export default function CircularDoublyLinkedListPage() {
  return <VisualizerShell adapter={cdllAdapter} Renderer={CdllCanvas} homeHref="/" />;
}
