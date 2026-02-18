"use client";

import { treeAdapter } from "@/features/ds/tree/adapter";
import { TreeCanvas } from "@/features/visualizer/components/tree-canvas";
import { VisualizerShell } from "@/features/visualizer/components/visualizer-shell";

export default function TreePage() {
  return <VisualizerShell adapter={treeAdapter} Renderer={TreeCanvas} homeHref="/ds" />;
}
