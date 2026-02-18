# Project Structure & Module Organization

이 저장소는 Next.js App Router 기반 단일 애플리케이션입니다.

- `app/`: 라우팅 및 UI 진입점 (`layout.tsx`, `page.tsx`, `globals.css`)
- `public/`: 정적 에셋(SVG, 아이콘 등)
- 루트 설정: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`
- 문서: `README.md`, `TODO.md`, `docs/agent/*`, `docs/task/*`

새 기능은 `app/` 아래에 라우트 단위로 추가하고, 공용 리소스는 `public/`에 둡니다.
