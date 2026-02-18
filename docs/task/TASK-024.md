# TASK-024

- id: TASK-024
- title: Grid BFS 입력 UI를 map/수동 영역으로 분리하고 map 우선 동작 명확화
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/trace/adapter.ts`
- `features/trace/components/trace-shell.tsx`
- `features/problem/grid-bfs/adapter.ts`
- `docs/task/TASK-024.md`
- `docs/task/INDEX.md`

## Definition of Done
- 입력 UI에서 map 영역과 수동(rows/cols/walls) 영역이 분리되어야 함
- map 입력 시 수동 영역이 숨김/비활성 처리되어 혼동이 없어야 함
- start/goal은 공통 영역으로 명확히 표시되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (23 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- Trace adapter input field metadata에 그룹/가시성 규칙 추가
