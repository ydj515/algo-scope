# Testing Guidelines

현재 저장소의 단위 테스트 프레임워크는 Vitest입니다.

- 작업 성공 최소 검증: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`
- 테스트 파일은 `features/**/*.test.ts` 패턴으로 Vitest에서 실행합니다.
- 기존 테스트를 유지하거나 확장할 때는 `node:test` 대신 Vitest API(`test`, `expect`)를 사용합니다.
- 테스트 도입 시 권장: 순수 로직 단위 테스트 + 주요 사용자 플로우 E2E
- 테스트 파일명 예시: `*.test.ts`, `*.test.tsx`

새 테스트 체계를 도입하면 관련 스크립트와 실행 방법을 이 문서에 즉시 업데이트합니다.
