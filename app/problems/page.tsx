import { CatalogGrid } from "@/features/navigation/components/catalog-grid";
import { problemCatalog } from "@/features/navigation/catalog-problems";
import { Card } from "@/features/ui/components/card";

function groupBySection() {
  const groups = new Map<string, typeof problemCatalog>();
  for (const item of problemCatalog) {
    const key = item.group ?? "Others";
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  return groups;
}

export default function ProblemsHubPage() {
  const groups = groupBySection();

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-10 text-[var(--color-fg)] sm:px-8 motion-fade-in">
      <div className="mx-auto w-full max-w-6xl">
        <Card className="mb-6 p-8 motion-slide-up" elevated>
          <p className="text-sm font-medium text-[var(--color-fg-muted)]">Problem Solving</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">문제풀이 허브</h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-fg-muted)]">
            탐색/동적계획/백트래킹 문제를 trace 기반으로 검증할 수 있는 어댑터 목록입니다.
          </p>
        </Card>

        <div className="space-y-7">
          {[...groups.entries()].map(([name, items]) => (
            <section
              key={name}
              id={`group-${name.toLowerCase()}`}
              className="scroll-mt-24 space-y-3"
            >
              <h2 className="text-xl font-semibold text-[var(--color-fg)]">{name}</h2>
              <CatalogGrid items={items} />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
