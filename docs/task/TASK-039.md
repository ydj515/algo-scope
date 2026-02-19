# TASK-039

- id: TASK-039
- title: 디자인 토큰/공통 Button·Card/서브틀 모션 3종 및 테마 지원 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `app/globals.css`
- `features/ui/components/button.tsx`
- `features/ui/components/card.tsx`
- `features/ui/utils/cn.ts`
- `features/navigation/components/theme-toggle.tsx`
- `features/navigation/components/global-nav.tsx`
- `features/navigation/components/catalog-grid.tsx`
- `app/page.tsx`
- `app/ds/page.tsx`
- `app/problems/page.tsx`
- `docs/task/TASK-039.md`
- `docs/task/INDEX.md`

## Definition of Done
- 전역 디자인 토큰(색/반경/모션)이 정의되어야 함
- 공통 `Button`, `Card` 컴포넌트가 추가되어야 함
- subtle 모션 3종(`fade-in`, `slide-up`, `pulse-focus`)이 추가되어야 함
- 라이트/다크 테마를 지원하고 전환 UI가 제공되어야 함
- 핵심 화면(네비/랜딩/허브/카탈로그)에 공통 컴포넌트가 적용되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과 (48 passed)
- `npm run build` 통과
