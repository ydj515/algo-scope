"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/features/navigation/components/theme-toggle";
import { Button } from "@/features/ui/components/button";

export function GlobalNav() {
  const pathname = usePathname();
  const isDs = pathname === "/ds" || pathname.startsWith("/ds/");
  const isProblems = pathname === "/problems" || pathname.startsWith("/problems/");
  const problemSubtabs = [
    { label: "Graph", href: "/problems#group-graph" },
    { label: "DP", href: "/problems#group-dp" },
    { label: "Backtracking", href: "/problems#group-backtracking" },
  ] as const;
  const activeProblemSubtab = pathname.startsWith("/problems/grid-")
    ? "Graph"
    : pathname.startsWith("/problems/dp-")
      ? "DP"
      : pathname.startsWith("/problems/backtracking-")
        ? "Backtracking"
        : null;
  const navHoverClass =
    "cursor-pointer transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-primary)]";

  return (
    <header className="border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] backdrop-blur motion-fade-in">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-[var(--color-fg)]">
            Algo Scope
          </Link>
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-2">
              <Button
                href="/ds"
                variant={isDs ? "solid" : "outline"}
                size="sm"
                tone={isDs ? "primary" : "neutral"}
                className={navHoverClass}
              >
                Data Structures
              </Button>
              <Button
                href="/problems"
                variant={isProblems ? "solid" : "outline"}
                size="sm"
                tone={isProblems ? "primary" : "neutral"}
                className={navHoverClass}
              >
                Problem Solving
              </Button>
            </nav>
            <ThemeToggle />
          </div>
        </div>

        {isProblems ? (
          <nav className="flex flex-wrap items-center gap-2">
            {problemSubtabs.map((tab) => {
              const isActive = activeProblemSubtab === tab.label;
              return (
                <Button key={tab.label} href={tab.href} variant={isActive ? "solid" : "outline"} size="sm" tone={isActive ? "primary" : "neutral"}>
                  {tab.label}
                </Button>
              );
            })}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
