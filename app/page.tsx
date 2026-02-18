import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8">
          <p className="text-sm font-medium text-blue-600">Algo Scope</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">자료구조/알고리즘 시각화 학습 도구</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600">
            연산 결과가 아니라 내부 상태 변화 과정을 Step-by-step으로 재생하며 학습하는 것을 목표로 합니다.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Circular Doubly Linked List</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Insert/Remove/Search 연산을 단계별로 실행하고, 각 step에서 pointer와 링크 변화를 시각화합니다.
            </p>
            <div className="mt-4">
              <Link
                href="/ds/circular-doubly-linked-list"
                className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                CDLL 시작
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Stack</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Push/Pop/Peek 연산을 Step 단위로 재생하며 top/bottom 변화와 복잡도를 학습합니다.
            </p>
            <div className="mt-4">
              <Link
                href="/ds/stack"
                className="inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Stack 시작
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Queue</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Enqueue/Dequeue/Peek 연산을 Step 단위로 재생하며 front/rear 변화와 FIFO 동작을 학습합니다.
            </p>
            <div className="mt-4">
              <Link
                href="/ds/queue"
                className="inline-flex rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Queue 시작
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Tree (BST)</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Insert/Search 연산을 Step 단위로 재생하며 노드 비교와 분기 경로를 학습합니다.
            </p>
            <div className="mt-4">
              <Link
                href="/ds/tree"
                className="inline-flex rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Tree 시작
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Problem Trace: Grid BFS</h2>
            <p className="mt-2 text-sm text-zinc-600">
              폼/텍스트 입력으로 grid 문제를 설정하고 BFS 탐색, 가지치기, 경로 복원을 step 단위로 검증합니다.
            </p>
            <div className="mt-4">
              <Link
                href="/problems/grid-bfs"
                className="inline-flex rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Grid BFS 시작
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Problem Trace: Grid DFS</h2>
            <p className="mt-2 text-sm text-zinc-600">
              폼/텍스트 입력으로 grid 문제를 설정하고 DFS 탐색, 가지치기, 경로 복원을 step 단위로 검증합니다.
            </p>
            <div className="mt-4">
              <Link
                href="/problems/grid-dfs"
                className="inline-flex rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Grid DFS 시작
              </Link>
            </div>
          </article>
        
          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Problem Trace: DP Recurrence</h2>
            <p className="mt-2 text-sm text-zinc-600">
              점화식을 직접 입력해 DP 테이블 계산 과정을 step 단위로 시각화합니다.
            </p>
            <div className="mt-4">
              <Link
                href="/problems/dp-recurrence"
                className="inline-flex rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                DP Recurrence 시작
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Problem Trace: 0/1 Knapsack DP</h2>
            <p className="mt-2 text-sm text-zinc-600">
              0/1 Knapsack 점화식 테이블과 선택 복원 과정을 step 단위로 확인합니다.
            </p>
            <div className="mt-4">
              <Link
                href="/problems/dp-knapsack"
                className="inline-flex rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Knapsack 시작
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Problem Trace: Grid Min Path Sum DP</h2>
            <p className="mt-2 text-sm text-zinc-600">
              최소 경로 합 DP 테이블과 경로 복원을 step 단위로 시각화합니다.
            </p>
            <div className="mt-4">
              <Link
                href="/problems/dp-grid-min-path"
                className="inline-flex rounded-md bg-lime-600 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-700"
              >
                Grid Min Path 시작
              </Link>
            </div>
          </article>

        
          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Problem Trace: Backtracking Generic</h2>
            <p className="mt-2 text-sm text-zinc-600">
              제약식/목표식을 직접 입력해 백트래킹 탐색 과정을 step 단위로 확인합니다.
            </p>
            <div className="mt-4">
              <Link
                href="/problems/backtracking-generic"
                className="inline-flex rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
              >
                Backtracking Generic 시작
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Problem Trace: N-Queens</h2>
            <p className="mt-2 text-sm text-zinc-600">
              N-Queens 백트래킹에서 선택/가지치기/해 발견 과정을 시각화합니다.
            </p>
            <div className="mt-4">
              <Link
                href="/problems/backtracking-n-queens"
                className="inline-flex rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700"
              >
                N-Queens 시작
              </Link>
            </div>
          </article>

        </section>
      </div>
    </main>
  );
}
