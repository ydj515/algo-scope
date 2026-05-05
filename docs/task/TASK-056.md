# TASK-056

- id: TASK-056
- title: 공통 렌더러 테스트 확대 및 CI/README 고도화
- owner: codex
- created_at: 2026-05-06
- completed_at: 2026-05-06
- status: done

## 작업 범위
- `features/problem/grid-bfs/canvas.test.tsx`
- `features/problem/dp/components/dp-table-canvas.test.tsx`
- `features/problem/backtracking/components/backtracking-canvas.test.tsx`
- `.github/workflows/ci.yml`
- `README.md`
- `docs/task/TASK-056.md`
- `docs/task/INDEX.md`

## 완료 기준
- `GridBfsCanvas`, `DpTableCanvas`, `BacktrackingCanvas`의 핵심 상태 렌더링이 테스트로 검증된다.
- CI가 브랜치 보호용 고정 체크 이름을 유지하면서 `main` 푸시 기준 캐시/아티팩트 업로드를 지원한다.
- `README.md`에 GitHub Actions 배지와 최신 테스트 가이드가 반영된다.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`가 모두 성공한다.

## 검증
- `npm run lint` 통과
- `npm run typecheck` 통과
- `npm run build` 통과
- `npm run test` 통과
- `GridBfsCanvas`, `DpTableCanvas`, `BacktrackingCanvas` 컴포넌트 테스트를 추가해 공통 렌더러 계층을 검증했다.
- 전체 테스트 결과 `17`개 테스트 파일, `64`개 테스트가 통과했다.
