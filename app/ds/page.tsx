import { CatalogGrid } from "@/features/navigation/components/catalog-grid";
import { dsCatalog } from "@/features/navigation/catalog-ds";

export default function DsHubPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-900 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-8">
          <p className="text-sm font-medium text-zinc-600">Data Structures</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">자료구조 허브</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600">
            연산 단위 상태 변화와 복잡도를 중심으로 학습할 수 있는 시각화 목록입니다.
          </p>
        </section>

        <CatalogGrid items={dsCatalog} />
      </div>
    </main>
  );
}
