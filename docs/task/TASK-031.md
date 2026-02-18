# TASK-031

- id: TASK-031
- title: DP 공통 테이블/옵션(복원, 상세·요약) + 점화식/Knapsack/Grid Min Path Sum 어댑터 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/problem/dp/*`
- `app/problems/dp-recurrence/page.tsx`
- `app/problems/dp-knapsack/page.tsx`
- `app/problems/dp-grid-min-path/page.tsx`
- `app/page.tsx`
- `tsconfig.test.json`
- `package.json`
- `docs/task/TASK-031.md`
- `docs/task/INDEX.md`

## Definition of Done
- 답만 보기 vs 선택 경로 복원 보기 옵션이 동작해야 함
- 상세/요약 모드(모든 셀 step vs 변경 셀 중심 step)가 동작해야 함
- 공통 DP 테이블 스냅샷/캔버스가 재사용되어야 함
- 점화식/0-1 knapsack/grid min path sum 어댑터가 추가되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (41 passed)
- `npm run lint` 통과
- `npm run build` 통과
