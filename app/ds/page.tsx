import { CatalogGrid } from "@/features/navigation/components/catalog-grid";
import { dsCatalog } from "@/features/navigation/catalog-ds";
import { Card } from "@/features/ui/components/card";

export default function DsHubPage() {
  return (
    <main className="page-main motion-fade-in">
      <div className="page-container">
        <Card className="mb-6 p-8 motion-slide-up" elevated>
          <p className="ty-label1 text-muted">Data Structures</p>
          <h1 className="mt-2 ty-title1 tracking-tight">자료구조 허브</h1>
          <p className="mt-3 max-w-2xl ty-label1 text-muted">
            연산 단위 상태 변화와 복잡도를 중심으로 학습할 수 있는 시각화 목록입니다.
          </p>
        </Card>

        <CatalogGrid items={dsCatalog} />
      </div>
    </main>
  );
}
