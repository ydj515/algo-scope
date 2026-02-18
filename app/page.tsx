import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-900 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8">
          <p className="text-sm font-medium text-blue-600">Algo Scope</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">자료구조/알고리즘 시각화 학습 도구</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600">
            학습 목적에 맞게 영역을 나눠 탐색하세요. 자료구조는 연산 중심, 문제풀이는 전략 중심 trace를 제공합니다.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-zinc-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Hub</p>
            <h2 className="mt-2 text-2xl font-semibold">Data Structures</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Stack, Queue, Tree, CDLL 같은 기본 자료구조 연산을 step-by-step으로 학습합니다.
            </p>
            <div className="mt-5">
              <Link
                href="/ds"
                className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                DS 허브로 이동
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-zinc-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Hub</p>
            <h2 className="mt-2 text-2xl font-semibold">Problem Solving</h2>
            <p className="mt-2 text-sm text-zinc-600">
              BFS/DFS, DP, Backtracking 문제 풀이 과정을 trace로 확인하고 가설을 검증합니다.
            </p>
            <div className="mt-5">
              <Link
                href="/problems"
                className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Problems 허브로 이동
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
