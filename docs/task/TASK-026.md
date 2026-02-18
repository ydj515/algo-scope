# TASK-026

- id: TASK-026
- title: Grid BFS map 입력값을 form 필드(rows/cols/walls/goal)에 자동 반영
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/trace/adapter.ts`
- `features/trace/components/trace-shell.tsx`
- `features/problem/grid-bfs/adapter.ts`
- `features/problem/grid-bfs/adapter.test.ts`
- `docs/task/TASK-026.md`
- `docs/task/INDEX.md`

## Definition of Done
- form 필드는 숨기지 않고 유지되어야 함
- map 입력 시 rows/cols/walls/goalRow/goalCol이 자동 세팅되어야 함
- 자동 세팅 동작 테스트가 추가되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (24 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- ProblemTraceAdapter에 form 입력 정규화 훅 추가
