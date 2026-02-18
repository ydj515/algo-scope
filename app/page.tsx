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
        </section>
      </div>
    </main>
  );
}
