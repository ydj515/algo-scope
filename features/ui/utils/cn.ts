/**
 * 조건부 className 조합을 공백 문자열 하나로 정규화합니다.
 * falsy 값은 제거하므로 UI 컴포넌트에서 조건부 스타일을 간단히 합칠 때 사용합니다.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
