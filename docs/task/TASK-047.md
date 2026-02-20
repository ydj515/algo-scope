# TASK-047

- id: TASK-047
- title: 테마 토글을 Sun/Moon 아이콘 버튼으로 단순화(system 제거)
- owner: codex
- created_at: 2026-02-19
- completed_at:
- status: in_progress

## Scope
- `features/navigation/components/theme-toggle.tsx`
- `docs/task/TASK-047.md`
- `docs/task/INDEX.md`

## Definition of Done
- `system` 테마 모드가 제거되어야 함
- Sun/Moon 아이콘 기반 토글 버튼으로 라이트/다크 전환이 동작해야 함
- 데스크톱/모바일 모두 동일 토글 UX를 사용해야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과
- `npm run build` 실패 (`/_global-error` prerender: `Cannot read properties of null (reading 'useContext')`)
