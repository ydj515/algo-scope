# TASK-009

- id: TASK-009
- title: Execute 직후 최종 Step(마지막 상태) 기본 표시
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/visualizer/use-stepper.ts`
- `app/ds/circular-doubly-linked-list/page.tsx`
- `docs/task/TASK-009.md`
- `docs/task/INDEX.md`

## Definition of Done
- Execute 실행 후 현재 step 인덱스가 마지막 step으로 설정되어야 함
- 기존 step 이동(Prev/Next/Play/Pause/Reset) 동작이 깨지지 않아야 함
- 작업 파일과 INDEX가 동기화되어야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과
- Execute 경로에서 `loadSteps(result.steps, result.steps.length - 1)` 적용 확인

## Notes
- 사용자 요청: Execute 직후 그림은 최종 상태를 보여줘야 함
