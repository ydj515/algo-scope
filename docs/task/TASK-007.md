# TASK-007

- id: TASK-007
- title: 브라우저 확장 주입 속성으로 인한 hydration warning 완화
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `app/layout.tsx`
- `docs/task/TASK-007.md`
- `docs/task/INDEX.md`

## Definition of Done
- 루트 hydration warning이 확장 프로그램 주입 속성으로 발생해도 개발 중 경고가 억제되어야 함
- 작업 파일과 INDEX가 동기화되어야 함

## Verification
- `npm run lint` 통과
- `app/layout.tsx`의 `<html>`에 `suppressHydrationWarning` 적용 확인

## Notes
- 원인: 브라우저 확장 프로그램이 `<html>` 태그에 임의 속성을 주입
