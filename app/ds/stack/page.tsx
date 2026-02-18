"use client";

import { stackAdapter } from "@/features/ds/stack/adapter";
import { StackCanvas } from "@/features/visualizer/components/stack-canvas";
import { VisualizerShell } from "@/features/visualizer/components/visualizer-shell";

export default function StackPage() {
  return <VisualizerShell adapter={stackAdapter} Renderer={StackCanvas} homeHref="/ds" />;
}
