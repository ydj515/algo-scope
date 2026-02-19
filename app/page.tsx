import { Button } from "@/features/ui/components/button";
import { Card } from "@/features/ui/components/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-10 text-[var(--color-fg)] sm:px-8 motion-fade-in">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Card className="p-8 motion-slide-up" elevated>
          <p className="text-sm font-medium text-[var(--color-primary)]">Algo Scope</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">자료구조/알고리즘 시각화 학습 도구</h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-fg-muted)]">
            학습 목적에 맞게 영역을 나눠 탐색하세요. 자료구조는 연산 중심, 문제풀이는 전략 중심 trace를 제공합니다.
          </p>
        </Card>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="p-6 motion-slide-up">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-muted)]">Hub</p>
            <h2 className="mt-2 text-2xl font-semibold">Data Structures</h2>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              Stack, Queue, Tree, CDLL 같은 기본 자료구조 연산을 step-by-step으로 학습합니다.
            </p>
            <div className="mt-5">
              <Button
                href="/ds"
                variant="solid"
                className="bg-[var(--color-fg)] text-[var(--color-surface)] hover:bg-[color-mix(in_srgb,var(--color-fg)_85%,black)]"
              >
                DS 허브로 이동
              </Button>
            </div>
          </Card>

          <Card className="p-6 motion-slide-up">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-muted)]">Hub</p>
            <h2 className="mt-2 text-2xl font-semibold">Problem Solving</h2>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              BFS/DFS, DP, Backtracking 문제 풀이 과정을 trace로 확인하고 가설을 검증합니다.
            </p>
            <div className="mt-5">
              <Button
                href="/problems"
                variant="solid"
                className="bg-[var(--color-fg)] text-[var(--color-surface)] hover:bg-[color-mix(in_srgb,var(--color-fg)_85%,black)]"
              >
                Problems 허브로 이동
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
