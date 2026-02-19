# TASK-041

- id: TASK-041
- title: 공통 Badge 도입 및 Shell 메시지 표준화 + 모바일 테마 드롭다운 최적화
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `app/globals.css`
- `features/ui/components/badge.tsx`
- `features/navigation/components/theme-toggle.tsx`
- `features/visualizer/components/visualizer-shell.tsx`
- `features/trace/components/trace-shell.tsx`
- `docs/task/TASK-041.md`
- `docs/task/INDEX.md`

## Definition of Done
- 공통 `Badge` 컴포넌트가 추가되어야 함
- Shell 메시지 영역이 `Badge` 기반으로 표준화되어야 함
- 테마 토글이 모바일에서 아이콘 버튼으로 접히고, 클릭 시 드롭다운이 열려야 함
- 데스크톱에서는 기존과 같이 즉시 선택 가능한 드롭다운이 유지되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과 (48 passed)
- `npm run build` 통과
