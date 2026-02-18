# TASK-034

- id: TASK-034
- title: Backtracking Generic candidateGenerator 추가 + N-Queens 대칭 해 제거 옵션 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/problem/backtracking/engine.ts`
- `features/problem/backtracking-generic/adapter.ts`
- `features/problem/backtracking-generic/adapter.test.ts`
- `features/problem/backtracking-n-queens/adapter.ts`
- `features/problem/backtracking-n-queens/adapter.test.ts`
- `docs/task/TASK-034.md`
- `docs/task/INDEX.md`

## Definition of Done
- Generic adapter에서 depth/partial 기반 candidateGenerator를 지원해야 함
- N-Queens에서 대칭 해 제거 옵션을 제공해야 함
- stopAfterFirst/detailMode/maxSteps와 함께 정상 동작해야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (48 passed)
- `npm run lint` 통과
- `npm run build` 통과
