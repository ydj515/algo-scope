"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "algo-scope-theme-mode";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.dataset.themeMode = mode;
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    applyTheme(mode);
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  const nextMode: ThemeMode = mode === "dark" ? "light" : "dark";
  const isDark = mode === "dark";

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`테마 전환 (현재: ${isDark ? "dark" : "light"}, 다음: ${nextMode})`}
        title={`Switch to ${nextMode}`}
        onClick={() => setMode(nextMode)}
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-primary)] motion-pulse-focus"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
          {isDark ? (
            <path
              d="M12.5 2.5A7.5 7.5 0 1 0 17.5 12 6 6 0 1 1 12.5 2.5Z"
              fill="currentColor"
            />
          ) : (
            <>
              <circle cx="10" cy="10" r="4" fill="currentColor" />
              <path
                d="M10 1.5V4M10 16V18.5M1.5 10H4M16 10H18.5M3.8 3.8L5.6 5.6M14.4 14.4L16.2 16.2M16.2 3.8L14.4 5.6M5.6 14.4L3.8 16.2"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
