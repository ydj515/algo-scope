import { CatalogGrid } from "@/features/navigation/components/catalog-grid";
import { dsCatalog } from "@/features/navigation/catalog-ds";
import { Card } from "@/features/ui/components/card";

export default function DsHubPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-10 text-[var(--color-fg)] sm:px-8 motion-fade-in">
      <div className="mx-auto w-full max-w-6xl">
        <Card className="mb-6 p-8 motion-slide-up" elevated>
          <p className="text-sm font-medium text-[var(--color-fg-muted)]">Data Structures</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">자료구조 허브</h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-fg-muted)]">
            연산 단위 상태 변화와 복잡도를 중심으로 학습할 수 있는 시각화 목록입니다.
          </p>
        </Card>

        <CatalogGrid items={dsCatalog} />
      </div>
    </main>
  );
}
