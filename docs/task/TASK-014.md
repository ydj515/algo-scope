# TASK-014

- id: TASK-014
- title: CDLL SVG 매직 넘버 상수화 리팩터링
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/visualizer/components/cdll-canvas.tsx`
- `docs/task/TASK-014.md`
- `docs/task/INDEX.md`

## Definition of Done
- CDLL 캔버스의 주요 숫자/색상 상수가 의미 있는 이름으로 추출되어야 함
- 기존 UI 출력과 동작이 유지되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과 (7 passed)
- `npm run build` 통과

## Notes
- 리뷰 코멘트 반영: SVG 매직 넘버 제거
