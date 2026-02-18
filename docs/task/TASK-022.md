# TASK-022

- id: TASK-022
- title: Problem Trace 기반 Grid BFS 시각화(폼/텍스트 입력 + TraceShell) 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/trace/types.ts`
- `features/trace/adapter.ts`
- `features/trace/use-trace-stepper.ts`
- `features/trace/components/trace-shell.tsx`
- `features/problem/grid-bfs/adapter.ts`
- `features/problem/grid-bfs/canvas.tsx`
- `features/problem/grid-bfs/adapter.test.ts`
- `app/problems/grid-bfs/page.tsx`
- `app/page.tsx`
- `tsconfig.test.json`
- `package.json`
- `docs/task/TASK-022.md`
- `docs/task/INDEX.md`

## Definition of Done
- ProblemTrace 타입(enter/update/prune/exit)이 정의되어야 함
- 폼 빌더 + 텍스트 탭을 갖는 공통 TraceShell이 동작해야 함
- Grid BFS 어댑터가 입력 파싱/검증/실행/step 생성을 제공해야 함
- Grid BFS 페이지 및 캔버스 시각화가 동작해야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (22 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- 기존 VisualizerShell과 별개로 문제풀이용 Trace 계층 추가
