"use client";

import { useEffect, useMemo, useState } from "react";
import type { TraceStep } from "@/features/trace/types";

/**
 * 문제 풀이 trace step 목록의 재생과 탐색 상태를 관리하는 공용 훅입니다.
 * 제네릭 snapshot 타입을 받아 BFS/DFS/DP/백트래킹 등 다양한 trace 화면에서 공통으로 사용합니다.
 */
export function useTraceStepper<TSnapshot>(initialSteps: Array<TraceStep<TSnapshot>> = []) {
  const [steps, setSteps] = useState<Array<TraceStep<TSnapshot>>>(initialSteps);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const currentStep = useMemo(() => {
    if (steps.length === 0) {
      return null;
    }
    return steps[currentIndex] ?? null;
  }, [steps, currentIndex]);

  const loadSteps = (nextSteps: Array<TraceStep<TSnapshot>>, startIndex = 0) => {
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
