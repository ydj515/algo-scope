"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/features/navigation/components/theme-toggle";
import { Button } from "@/features/ui/components/button";
import { cn } from "@/features/ui/utils/cn";

export function GlobalNav() {
  const pathname = usePathname();
  const isDs = pathname === "/ds" || pathname.startsWith("/ds/");
  const isProblems = pathname === "/problems" || pathname.startsWith("/problems/");
  const mainTabs = [
    { label: "Data Structures", href: "/ds", active: isDs },
    { label: "Problem Solving", href: "/problems", active: isProblems },
  ] as const;
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

  return (
    <header className="border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] backdrop-blur motion-fade-in">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-[var(--color-fg)]">
            Algo Scope
          </Link>
          <div className="flex items-center gap-2">
            <nav className="relative grid grid-cols-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[var(--shadow-sm)]">
              {mainTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "relative z-10 whitespace-nowrap rounded-[var(--radius-md)] px-2.5 py-1.5 text-center text-xs font-semibold",
                    "transition-[background-color,color,box-shadow] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] sm:px-3 sm:text-sm",
                    tab.active
                      ? "bg-[var(--color-surface-muted)] text-[var(--color-fg)] shadow-[var(--shadow-sm)]"
                      : "text-[var(--color-fg-muted)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))] hover:text-[var(--color-primary)]",
                  )}
                >
                  {tab.label}
                </Link>
              ))}
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
