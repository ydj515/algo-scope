# TASK-021

- id: TASK-021
- title: 템플릿 구조 기반 Tree 시각화 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `lib/complexity/tree.ts`
- `features/ds/tree/operations.ts`
- `features/ds/tree/adapter.ts`
- `features/ds/tree/operations.test.ts`
- `features/visualizer/components/tree-canvas.tsx`
- `app/ds/tree/page.tsx`
- `app/page.tsx`
- `tsconfig.test.json`
- `package.json`
- `docs/task/TASK-021.md`
- `docs/task/INDEX.md`

## Definition of Done
- 템플릿 셸 기반으로 Tree 페이지가 동작해야 함
- insert/search 연산 step 재생과 복잡도 표시가 가능해야 함
- Tree 로직 유닛 테스트가 추가되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (19 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- 기존 VisualizerShell + DS adapter 패턴 재사용
