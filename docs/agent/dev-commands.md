# Build, Test, and Development Commands

패키지 매니저는 `npm` 기준으로 통일합니다.

- `npm run dev`: 로컬 개발 서버 실행 (`http://localhost:3000`)
- `npm run build`: 프로덕션 빌드 생성
- `npm run start`: 빌드 결과 실행
- `npm run lint`: ESLint 검사 실행
- `npm run typecheck`: TypeScript 타입 검사 실행
- `npm run test`: Vitest 테스트 실행

작업을 성공으로 처리하기 위한 기본 검증 기준은 `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`입니다.
