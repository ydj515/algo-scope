# TASK-061

- id: TASK-061
- title: Node.js 버전 상향에 따른 의존성 재설치 및 패키지 버전 업그레이드
- owner: codex
- created_at: 2026-11-23
- completed_at: 2026-11-23
- status: done

## 작업 범위
- `mise.toml`
- `.github/workflows/ci.yml`
- `package.json`
- `package-lock.json`
- `docs/task/TASK-061.md`
- `docs/task/INDEX.md`

## 완료 기준
- 상향된 Node.js 버전(`24.22.3`)에 맞춰 `npm ci` 및 의존성 패키지(`@types/node` 포함) 버전 업그레이드를 반영한다.
- CI 워크플로의 Node.js 버전 설정이 로컬 `mise.toml` 버전과 정합성을 유지한다.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`가 모두 성공한다.

## 검증
- `npm ci` 통과 (보안 취약점 0건 확인)
- `npm run lint` 통과
- `npm run typecheck` 통과
- `npm run build` 통과
- `npm run test` 통과 (23개 테스트 파일, 76개 테스트 통과)
- `package.json` 및 `package-lock.json` 의존성 업그레이드 반영 (`next`/`eslint-config-next` `16.4.6`, `react`/`react-dom` `19.3.1`, `@types/node` `^24`, `@testing-library/react` `^16.3.3`, `@testing-library/user-event` `^14.6.13`, `vitest`/`@vitest/coverage-v8` `^4.1.12` 등)
- `.github/workflows/ci.yml`의 `node-version`을 `24.22.3`으로 동기화
