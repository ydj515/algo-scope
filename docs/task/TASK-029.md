# TASK-029

- id: TASK-029
- title: Grid BFS/DFS blockedValues 조건식 지원 + matrix 셀 값 표시 옵션 + 폼 설명 보강
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/problem/grid-bfs/adapter.ts`
- `features/problem/grid-bfs/canvas.tsx`
- `features/problem/grid-bfs/adapter.test.ts`
- `features/problem/grid-dfs/adapter.ts`
- `features/problem/grid-dfs/canvas.tsx`
- `features/problem/grid-dfs/adapter.test.ts`
- `docs/task/TASK-029.md`
- `docs/task/INDEX.md`

## Definition of Done
- blockedValues가 숫자 목록뿐 아니라 조건식(`<0`, `<=1`, `!=2` 등)을 지원해야 함
- matrix 모드에서 셀 숫자 표시 옵션(showCellValues)을 지원해야 함
- BFS/DFS 폼 필드 helper text가 강화되어 의미 파악이 쉬워야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (33 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- 조건식 파서는 공통 규칙으로 BFS/DFS 양쪽에 동일 적용
