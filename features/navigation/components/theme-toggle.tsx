"use client";

import { useEffect, useRef, useState } from "react";

type ThemeMode = "system" | "light" | "dark";

const THEME_STORAGE_KEY = "algo-scope-theme-mode";

function resolveSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  const actual = mode === "system" ? resolveSystemTheme() : mode;
  root.dataset.theme = actual;
  root.dataset.themeMode = mode;
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "system";
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });
  const [openMobile, setOpenMobile] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    applyTheme(mode);
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);

    if (mode !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, [mode]);

  useEffect(() => {
    if (!openMobile) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!rootRef.current || (target && rootRef.current.contains(target))) {
        return;
      }
      setOpenMobile(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMobile]);

  return (
    <div ref={rootRef} className="relative">
      <label className="hidden items-center gap-2 text-xs font-semibold text-[var(--color-fg-muted)] sm:inline-flex">
        Theme
        <select
          value={mode}
          onChange={(event) => setMode(event.target.value as ThemeMode)}
          aria-label="테마 선택"
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-fg)]"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <button
        type="button"
        aria-label="모바일 테마 메뉴"
        onClick={() => setOpenMobile((prev) => !prev)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-fg)] sm:hidden"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 1.5V4M10 16V18.5M1.5 10H4M16 10H18.5M3.8 3.8L5.6 5.6M14.4 14.4L16.2 16.2M16.2 3.8L14.4 5.6M5.6 14.4L3.8 16.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      {openMobile ? (
        <div className="absolute right-0 z-20 mt-2 w-36 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-sm)] sm:hidden">
          <label className="mb-1 block text-[11px] font-semibold text-[var(--color-fg-muted)]">Theme</label>
          <select
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as ThemeMode);
              setOpenMobile(false);
            }}
            aria-label="모바일 테마 선택"
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs text-[var(--color-fg)]"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      ) : null}
    </div>
  );
}
