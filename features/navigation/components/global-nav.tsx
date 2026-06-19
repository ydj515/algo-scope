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
    <header className="global-header motion-fade-in">
      <div className="page-container flex flex-col gap-2 px-4 py-3 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="ty-label1 font-bold">
            Algo Scope
          </Link>
          <div className="flex items-center gap-2">
            <nav className="nav-segmented">
              {mainTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "nav-tab",
                    tab.active ? "nav-tab--active" : "nav-tab--inactive",
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
