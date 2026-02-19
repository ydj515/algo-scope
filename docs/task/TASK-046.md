# TASK-046

- id: TASK-046
- title: CanvasFrame header 슬롯 추가 및 캔버스 상단 메타 공통화
- owner: codex
- created_at: 2026-02-19
- completed_at: 2026-02-19
- status: done

## Scope
- `features/ui/components/canvas-frame.tsx`
- `features/problem/grid-bfs/canvas.tsx`
- `features/problem/grid-dfs/canvas.tsx`
- `features/problem/dp/components/dp-table-canvas.tsx`
- `features/problem/backtracking/components/backtracking-canvas.tsx`
- `features/problem/backtracking-n-queens/canvas.tsx`
- `docs/task/TASK-046.md`
- `docs/task/INDEX.md`

## Definition of Done
- `CanvasFrame`에 `header` 슬롯이 추가되어야 함
- 상단 메타(타이틀/요약)를 공통 `header` 슬롯으로 이동해야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과
- `npm run build` 통과
