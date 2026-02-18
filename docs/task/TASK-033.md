# TASK-033

- id: TASK-033
- title: Backtracking 공통 어댑터 + N-Queens 어댑터 추가(옵션: stopAfterFirst/detailMode/maxSteps)
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/problem/backtracking/*`
- `features/problem/backtracking-generic/*`
- `features/problem/backtracking-n-queens/*`
- `app/problems/backtracking-generic/page.tsx`
- `app/problems/backtracking-n-queens/page.tsx`
- `app/page.tsx`
- `tsconfig.test.json`
- `package.json`
- `docs/task/TASK-033.md`
- `docs/task/INDEX.md`

## Definition of Done
- 공통 백트래킹 스냅샷/엔진/캔버스가 추가되어야 함
- 제너럴 백트래킹 어댑터가 추가되어야 함
- N-Queens 어댑터가 문제별 구현으로 추가되어야 함
- 옵션(stopAfterFirst, detail/summary, maxSteps)이 동작해야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (46 passed)
- `npm run lint` 통과
- `npm run build` 통과
