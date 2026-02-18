# TASK-030

- id: TASK-030
- title: matrix blockedValues 조건식 적용 시 start/goal 자동 예외 처리
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/problem/grid-bfs/adapter.ts`
- `features/problem/grid-bfs/adapter.test.ts`
- `features/problem/grid-dfs/adapter.ts`
- `features/problem/grid-dfs/adapter.test.ts`
- `docs/task/TASK-030.md`
- `docs/task/INDEX.md`

## Definition of Done
- map 기반 벽 자동 추론 시 start/goal은 벽에서 자동 제외되어야 함
- `>5` 같은 조건식에서도 실행이 중단되지 않아야 함
- BFS/DFS 테스트가 추가되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (35 passed)
- `npm run lint` 통과
- `npm run build` 통과
