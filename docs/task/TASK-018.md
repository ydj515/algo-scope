# TASK-018

- id: TASK-018
- title: Visualizer 템플릿화(공통 Shell/OperationConfig/DS 어댑터/복잡도 메타 분리)
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/visualizer/adapter.ts`
- `features/visualizer/components/visualizer-shell.tsx`
- `features/ds/cdll/adapter.ts`
- `features/ds/cdll/operations.ts`
- `lib/complexity/cdll.ts`
- `app/ds/circular-doubly-linked-list/page.tsx`
- `docs/task/TASK-018.md`
- `docs/task/INDEX.md`

## Definition of Done
- 공통 VisualizerShell 컴포넌트가 추가되어야 함
- OperationConfig 기반으로 입력 UI가 동작해야 함
- DS 어댑터 인터페이스 및 CDLL 어댑터 구현이 추가되어야 함
- 복잡도 메타가 `lib/complexity`로 분리되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (7 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- MVP 이후 다중 DS 확장 대비 템플릿화
