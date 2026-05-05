# TASK-055

- id: TASK-055
- title: CI 식별자 정리 및 공통 UI 레이어 컴포넌트 테스트 확장
- owner: codex
- created_at: 2026-05-06
- completed_at: 2026-05-06
- status: done

## 작업 범위
- `.github/workflows/ci.yml`
- `package.json`
- `package-lock.json`
- `vitest.config.ts`
- `vitest.setup.ts`
- `features/trace/components/trace-shell.test.tsx`
- `features/visualizer/components/visualizer-shell.test.tsx`
- `docs/task/TASK-055.md`
- `docs/task/INDEX.md`

## 완료 기준
- 브랜치 보호 규칙에서 식별하기 쉬운 워크플로 이름과 job 이름으로 CI를 정리한다.
- `Vitest + Testing Library + jsdom` 조합으로 공통 UI 레이어 컴포넌트 테스트를 추가한다.
- `TraceShell`, `VisualizerShell`의 핵심 사용자 상호작용이 테스트로 검증된다.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`가 모두 성공한다.

## 검증
- `npm run lint` 통과
- `npm run typecheck` 통과
- `npm run build` 통과
- `npm run test` 통과
- `Vitest + Testing Library + jsdom` 기반으로 `TraceShell`, `VisualizerShell` 컴포넌트 테스트를 추가했다.
- 전체 테스트 결과 `14`개 테스트 파일, `58`개 테스트가 통과했다.
