# TASK-044

- id: TASK-044
- title: CanvasFrame 도입 + Grid BFS/DFS/DP SVG 색상 토큰화 + RangeField 공통화
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-19
- status: done

## Scope
- `app/globals.css`
- `features/ui/components/canvas-frame.tsx`
- `features/ui/components/field.tsx`
- `features/visualizer/components/visualizer-shell.tsx`
- `features/trace/components/trace-shell.tsx`
- `features/problem/grid-bfs/canvas.tsx`
- `features/problem/grid-dfs/canvas.tsx`
- `features/problem/dp/components/dp-table-canvas.tsx`
- `docs/task/TASK-044.md`
- `docs/task/INDEX.md`

## Definition of Done
- Canvas 공통 래퍼(`CanvasFrame`)가 추가되어야 함
- Grid BFS/DFS/DP 캔버스의 SVG 색상이 토큰 기반으로 치환되어야 함
- Shell의 range 입력이 `RangeField`로 통일되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과
- `npm run build` 통과
