"use client";

import { useEffect, useMemo, useState } from "react";
import type { Step } from "@/features/visualizer/types";

/**
 * 자료구조 시각화 step 목록의 현재 위치, 재생 상태, 탐색 제어를 관리하는 공용 훅입니다.
 * VisualizerShell 계열 화면이 동일한 스테퍼 동작을 재사용할 수 있도록 상태와 제어 함수를 묶어 제공합니다.
 */
export function useStepper(initialSteps: Step[] = []) {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const currentStep = useMemo(() => {
    if (steps.length === 0) {
      return null;
    }
    return steps[currentIndex] ?? null;
  }, [steps, currentIndex]);

  const loadSteps = (nextSteps: Step[], startIndex = 0) => {
    setSteps(nextSteps);
    const boundedIndex = Math.min(
      Math.max(startIndex, 0),
      Math.max(nextSteps.length - 1, 0),
    );
    setCurrentIndex(boundedIndex);
    setIsPlaying(false);
  };

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, Math.max(steps.length - 1, 0)));
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const jumpTo = (index: number) => {
    setCurrentIndex(Math.min(Math.max(index, 0), Math.max(steps.length - 1, 0)));
  };

  const play = () => {
    if (steps.length === 0) {
      return;
    }
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const reset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying || steps.length === 0) {
      return;
    }

    const intervalMs = Math.max(200, 1000 / speed);
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPlaying, steps.length, speed]);

  return {
    steps,
    currentIndex,
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    loadSteps,
    next,
    prev,
    jumpTo,
    play,
    pause,
    reset,
  };
}
