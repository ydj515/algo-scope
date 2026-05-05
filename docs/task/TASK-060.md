# TASK-060

- id: TASK-060
- title: lib 및 재사용 공개 API JSDoc 추가
- owner: codex
- created_at: 2026-05-06
- completed_at: 2026-05-06
- status: done

## 작업 범위
- `lib/complexity/cdll.ts`
- `lib/complexity/queue.ts`
- `lib/complexity/stack.ts`
- `lib/complexity/tree.ts`
- `features/ui/utils/cn.ts`
- `features/visualizer/use-stepper.ts`
- `features/trace/use-trace-stepper.ts`
- `features/visualizer/adapter.ts`
- `features/trace/adapter.ts`
- `features/problem/backtracking/engine.ts`
- `eslint.config.mjs`
- `docs/task/TASK-060.md`
- `docs/task/INDEX.md`

## 완료 기준
- `lib/complexity` 하위 모든 export에 용도와 사용 맥락이 드러나는 `JSDoc`이 추가된다.
- 재사용도가 높은 공개 훅, 어댑터 타입, 공용 유틸에도 `JSDoc`이 추가된다.
- 기존 동작과 타입에는 변경이 없다.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`가 모두 성공한다.

## 검증
- `npm run lint` 통과
- `npm run typecheck` 통과
- `npm run build` 통과
- `npm run test` 통과
- `lib/complexity` 하위 export 상수 4종에 JSDoc 추가
- `useStepper`, `useTraceStepper`, `cn`, `DsAdapter`, `ProblemTraceAdapter`, `runBacktrackingEngine` 등 재사용 공개 API에 JSDoc 추가
- `eslint.config.mjs`에 `coverage/**` ignore를 추가해 생성 산출물로 인한 lint 경고를 제거
