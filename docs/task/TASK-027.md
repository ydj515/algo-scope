# TASK-027

- id: TASK-027
- title: Problem Trace 기반 Grid DFS 시각화 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/problem/grid-dfs/adapter.ts`
- `features/problem/grid-dfs/canvas.tsx`
- `features/problem/grid-dfs/adapter.test.ts`
- `app/problems/grid-dfs/page.tsx`
- `app/page.tsx`
- `tsconfig.test.json`
- `package.json`
- `docs/task/TASK-027.md`
- `docs/task/INDEX.md`

## Definition of Done
- Grid DFS 어댑터가 폼/텍스트 입력과 trace step을 지원해야 함
- map 입력 자동 세팅(rows/cols/walls/goal) 규칙이 DFS에도 동일 적용되어야 함
- DFS 페이지 및 캔버스가 동작해야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (29 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- Grid BFS 패턴을 재사용하되 탐색 로직은 stack 기반 DFS로 구현
