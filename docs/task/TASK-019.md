# TASK-019

- id: TASK-019
- title: 템플릿 구조 기반 Stack 시각화 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `lib/complexity/stack.ts`
- `features/ds/stack/operations.ts`
- `features/ds/stack/adapter.ts`
- `features/ds/stack/operations.test.ts`
- `features/visualizer/components/stack-canvas.tsx`
- `app/ds/stack/page.tsx`
- `app/page.tsx`
- `tsconfig.test.json`
- `package.json`
- `docs/task/TASK-019.md`
- `docs/task/INDEX.md`

## Definition of Done
- 템플릿 셸 기반으로 Stack 페이지가 동작해야 함
- push/pop/peek 연산 step 재생과 복잡도 표시가 가능해야 함
- Stack 로직 유닛 테스트가 추가되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (11 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- 기존 VisualizerShell + DS adapter 패턴 재사용
