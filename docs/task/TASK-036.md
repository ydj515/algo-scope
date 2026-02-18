# TASK-036

- id: TASK-036
- title: DS/Problems 허브 분리 및 랜딩/카탈로그/글로벌 네비 재구성
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `app/layout.tsx`
- `app/page.tsx`
- `app/ds/page.tsx`
- `app/problems/page.tsx`
- `app/ds/*/page.tsx`
- `app/problems/*/page.tsx`
- `features/navigation/types.ts`
- `features/navigation/catalog-ds.ts`
- `features/navigation/catalog-problems.ts`
- `features/navigation/components/global-nav.tsx`
- `features/navigation/components/catalog-grid.tsx`
- `docs/task/TASK-036.md`
- `docs/task/INDEX.md`

## Definition of Done
- `/ds`, `/problems` 허브 페이지가 추가되어야 함
- `/`는 랜딩/게이트웨이로 축소되어야 함
- 카드 메타가 카탈로그 파일로 이동되어야 함
- 상단 글로벌 네비(DS/Problems 탭)가 추가되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과 (48 passed)
- `npm run build` 통과
