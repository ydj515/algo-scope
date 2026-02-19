# TASK-043

- id: TASK-043
- title: 공통 UI 컴포넌트 추출 상태 점검 Audit
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/ui/components/*`
- `features/navigation/components/*`
- `features/visualizer/components/*`
- `features/trace/components/*`
- `features/problem/**/*canvas.tsx`
- `app/**/*.tsx`
- `docs/task/TASK-043.md`
- `docs/task/INDEX.md`

## Definition of Done
- 공통 컴포넌트 사용 분포를 점검해야 함
- 직접 스타일/직접 폼 컨트롤 사용 잔여 지점을 식별해야 함
- 우선순위별 개선 항목(즉시/다음 단계)을 제시해야 함

## Verification
- 공통 UI import 분포 스캔 완료 (`Button/Card/Badge/Field`)
- 직접 DOM 폼 컨트롤 사용 잔여 지점 스캔 완료
- 캔버스/범례 스타일 하드코딩 잔여 지점 식별 완료
