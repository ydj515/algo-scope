import { dsCatalog } from "@/features/navigation/catalog-ds";
import { problemCatalog } from "@/features/navigation/catalog-problems";
import { Button } from "@/features/ui/components/button";
import { Card } from "@/features/ui/components/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-10 text-[var(--color-fg)] sm:px-8 motion-fade-in">
      <div className="mx-auto w-full max-w-6xl">
        <section className="grid auto-rows-[minmax(150px,auto)] grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[178px]">
          <Card className="flex flex-col justify-between p-7 md:col-span-2 md:row-span-2 md:p-8" data-delay="1" elevated motion="slide">
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-[var(--color-primary)]">Algo Scope</p>
              <h1 className="mt-3 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                자료구조와 알고리즘 흐름을 한 단계씩 추적합니다
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-fg-muted)]">
                연산, 방문 순서, DP 테이블, 백트래킹 분기를 같은 인터랙션 패턴으로 관찰하며 학습 목적에 맞게 빠르게 이동하세요.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              <Button href="/ds" variant="solid">
                자료구조 보기
              </Button>
              <Button href="/problems" variant="outline" tone="neutral">
                문제풀이 보기
              </Button>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-5" data-delay="2" hoverable motion="slide">
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-[var(--color-fg-muted)]">DS</p>
              <h2 className="mt-2 text-xl font-semibold">Data Structures</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-fg-muted)]">
                Stack, Queue, Tree, CDLL 연산을 step-by-step으로 학습합니다.
              </p>
            </div>
            <Button href="/ds" variant="subtle" className="mt-5 self-start">
              DS 허브
            </Button>
          </Card>

          <Card className="flex flex-col justify-between p-5" data-delay="3" hoverable motion="slide">
            <div>
              <p className="font-mono text-xs font-semibold uppercase text-[var(--color-fg-muted)]">Trace</p>
              <h2 className="mt-2 text-xl font-semibold">Problem Solving</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-fg-muted)]">
                BFS/DFS, DP, Backtracking 풀이 과정을 trace로 검증합니다.
              </p>
            </div>
            <Button href="/problems" variant="subtle" className="mt-5 self-start">
              Problems 허브
            </Button>
          </Card>

          <Card className="grid grid-cols-2 gap-4 p-5 md:col-span-2" data-delay="4" elevated motion="slide">
            <div>
              <p className="font-mono text-3xl font-bold text-[var(--color-primary)]">{dsCatalog.length}</p>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">자료구조 시각화</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold text-[var(--color-success)]">{problemCatalog.length}</p>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">문제풀이 trace</p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-5 md:col-span-2" data-delay="5" hoverable motion="slide">
            <p className="font-mono text-xs font-semibold uppercase text-[var(--color-fg-muted)]">Workflow</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-fg-muted)]">
              입력을 바꾸고 Execute를 누른 뒤, Step List와 Canvas를 오가며 시간·공간 복잡도와 상태 변화를 함께 확인합니다.
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}
