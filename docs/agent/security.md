# Security & Configuration Tips

- 민감 정보는 커밋하지 말고 환경 변수(`.env.local`)를 사용합니다.
- 외부 연동 키는 클라이언트 번들 노출 여부를 먼저 검토합니다.
- 의존성 업그레이드 시 `npm run lint`와 `npm run build`로 회귀를 확인합니다.
