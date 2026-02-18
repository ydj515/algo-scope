"use client";

import { queueAdapter } from "@/features/ds/queue/adapter";
import { QueueCanvas } from "@/features/visualizer/components/queue-canvas";
import { VisualizerShell } from "@/features/visualizer/components/visualizer-shell";

export default function QueuePage() {
  return <VisualizerShell adapter={queueAdapter} Renderer={QueueCanvas} homeHref="/" />;
}
