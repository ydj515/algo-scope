"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function tabClass(active: boolean): string {
  return active
    ? "rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white"
    : "rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50";
}

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

  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-bold text-zinc-900">
            Algo Scope
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/ds" className={tabClass(isDs)}>
              Data Structures
            </Link>
            <Link href="/problems" className={tabClass(isProblems)}>
              Problem Solving
            </Link>
          </nav>
        </div>

        {isProblems ? (
          <nav className="flex flex-wrap items-center gap-2">
            {problemSubtabs.map((tab) => {
              const isActive = activeProblemSubtab === tab.label;
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={
                    isActive
                      ? "rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white"
                      : "rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  }
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
