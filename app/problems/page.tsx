import { CatalogGrid } from "@/features/navigation/components/catalog-grid";
import { problemCatalog } from "@/features/navigation/catalog-problems";

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
    <main className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-900 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-8">
          <p className="text-sm font-medium text-zinc-600">Problem Solving</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">문제풀이 허브</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600">
            탐색/동적계획/백트래킹 문제를 trace 기반으로 검증할 수 있는 어댑터 목록입니다.
          </p>
        </section>

        <div className="space-y-7">
          {[...groups.entries()].map(([name, items]) => (
            <section
              key={name}
              id={`group-${name.toLowerCase()}`}
              className="scroll-mt-24 space-y-3"
            >
              <h2 className="text-xl font-semibold text-zinc-900">{name}</h2>
              <CatalogGrid items={items} />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
