# TASK-028

- id: TASK-028
- title: Grid BFS/DFS 입력 모드 확장(binary map + numeric matrix)
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/trace/adapter.ts`
- `features/trace/components/trace-shell.tsx`
- `features/problem/grid-bfs/adapter.ts`
- `features/problem/grid-bfs/adapter.test.ts`
- `features/problem/grid-dfs/adapter.ts`
- `features/problem/grid-dfs/adapter.test.ts`
- `docs/task/TASK-028.md`
- `docs/task/INDEX.md`

## Definition of Done
- BFS/DFS 모두 map 입력 모드(binary/matrix)를 지원해야 함
- matrix 모드에서 공백 구분 숫자 격자를 파싱해야 함
- blockedValues(예: 0,-1) 기반 벽 추론을 지원해야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (31 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- 기존 map 자동 세팅(rows/cols/walls/goal) 규칙 유지
