# TASK-062

- id: TASK-062
- title: ci-workflows 기반 dev-standards 동기화 워크플로 적용, README 배지 추가 및 .codex/.gemini 제거
- owner: codex
- created_at: 2026-11-23
- completed_at: 2026-11-23
- status: done

## 작업 범위
- `.dev-standards/config.yml`
- `.github/workflows/sync-dev-standards.yml`
- `.github/workflows/noti-gemini-pr-review-slack.yml` (제거)
- `.github/workflows/sync-gemini-pr-review-styleguide.yml` (제거)
- `.codex/**` (제거)
- `.gemini/**` (제거)
- `AGENTS.md`
- `README.md`
- `docs/agent/codex-rules-policy.md`
- `docs/task/TASK-062.md`
- `docs/task/INDEX.md`

## 완료 기준
- `ci-workflows`의 재사용 워크플로(`sync-dev-standards.yml`)를 호출하는 GitHub Actions 워크플로를 추가한다.
- 저장소 기술 스택(`typescript`, `route-feature`, `react-ts`, `next-ts`, `tailwind`, `eslint`, `eslint-plugin-react-hooks`, `eslint-config-next`, `vitest`, `mise`)에 맞는 `.dev-standards/config.yml`을 추가한다.
- 기존 로컬 `.codex`, `.gemini` 디렉터리를 제거하고 관련 문서 참조를 갱신한다.
- `README.md` 상단에 워크플로 상태 배지 및 주요 기술 스택 버전 배지를 추가한다.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`가 모두 성공한다.

## 검증
- `npm run lint` 통과
- `npm run typecheck` 통과
- `npm run build` 통과
- `npm run test` 통과 (23개 테스트 파일, 76개 테스트 통과)
- `.dev-standards/config.yml` 및 `.github/workflows/sync-dev-standards.yml` YAML 구문 검증 및 `dev-standards` 조합 스크립트 검증 완료
- `.codex`, `.gemini` 디렉터리 제거 및 `AGENTS.md`, `README.md`, `docs/agent/codex-rules-policy.md` 참조 갱신 완료
