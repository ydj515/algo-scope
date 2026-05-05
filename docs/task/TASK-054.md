# TASK-054

- id: TASK-054
- title: 핵심 로직 테스트 보강 및 CI 고정 검증 파이프라인 추가
- owner: codex
- created_at: 2026-05-06
- completed_at: 2026-05-06
- status: done

## 작업 범위
- `features/problem/backtracking/engine.ts`
- `features/problem/backtracking/engine.test.ts`
- `mise.toml`
- `.github/workflows/ci.yml`
- `docs/task/TASK-054.md`
- `docs/task/INDEX.md`

## 완료 기준
- 사용자 영향이 큰 핵심 공용 로직을 선정해 테스트를 추가한다.
- GitHub Actions에 `lint`, `typecheck`, `build`, `test` 4단계 고정 파이프라인을 추가한다.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`가 모두 성공한다.

## 검증
- `npm run lint` 통과
- `npm run typecheck` 통과
- `npm run build` 통과
- `npm run test` 통과
- 공통 백트래킹 엔진 테스트 5건을 추가해 요약 모드, 상세 모드, `snapshotEnhancer`, `maxSteps`, `candidateGenerator` 예외 동작을 확인했다.
