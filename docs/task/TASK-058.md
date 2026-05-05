# TASK-058

- id: TASK-058
- title: 자료구조 렌더러 테스트 확대 및 PR 커버리지 가시성 강화
- owner: codex
- created_at: 2026-05-06
- completed_at: 2026-05-06
- status: done

## 작업 범위
- `features/visualizer/components/queue-canvas.test.tsx`
- `features/visualizer/components/stack-canvas.test.tsx`
- `features/visualizer/components/tree-canvas.test.tsx`
- `.github/workflows/ci.yml`
- `.gitignore`
- `docs/task/TASK-058.md`
- `docs/task/INDEX.md`

## 완료 기준
- `QueueCanvas`, `StackCanvas`, `TreeCanvas` 테스트가 추가된다.
- PR에서 커버리지 요약이 artifact 외에도 코멘트 또는 체크 요약으로 더 눈에 띄게 노출된다.
- 생성 산출물인 `reports/`의 버전 관리 제외 여부를 검토해 적절히 반영한다.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`, `npm run test:ci`가 모두 성공한다.

## 검증
- `npm run lint` 통과
- `npm run typecheck` 통과
- `npm run build` 통과
- `npm run test` 통과
- `npm run test:ci` 통과
- `QueueCanvas`, `StackCanvas`, `TreeCanvas` 테스트를 추가했다.
- PR용 커버리지 요약 파일(`reports/coverage-comment.md`) 생성과 sticky comment 워크플로 구성을 반영했다.
- 생성 산출물 디렉터리인 `reports/`를 `.gitignore`에 추가해 버전 관리에서 제외했다.
- 전체 테스트 결과 `23`개 테스트 파일, `76`개 테스트가 통과했다.
