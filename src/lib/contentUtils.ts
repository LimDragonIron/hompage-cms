/**
 * ---------------------------------------------------------------------------
 * isContentEmpty 함수
 *
 * - HTML 컨텐츠의 "실제 내용"이 비어있는지 확인하는 유틸 함수입니다.
 * - HTML 태그(<...>), &nbsp;, 줄바꿈 등을 모두 제거한 뒤, 남은 텍스트가 없으면 true를 반환합니다.
 *
 * @param text - 검사할 HTML 문자열
 * @returns boolean - 비어있으면 true, 아니면 false
 * ---------------------------------------------------------------------------
 */
export function isContentEmpty(text: string) {
  // 모든 HTML 태그 제거, &nbsp; 제거, 앞뒤 공백 제거
  const cleaned = text.replace(/<(.|\n)*?>/g, "").replace(/&nbsp;/gi, "").trim();
  return cleaned.length === 0;
}

/**
 * ---------------------------------------------------------------------------
 * isValidTag 함수
 *
 * - 해시태그의 유효성을 검사하는 함수입니다.
 * - 허용: 한글, 영문, 숫자만 사용 가능 (특수문자 및 공백 불가)
 * - 정규표현식: ^[\w가-힣]+$
 *
 * @param tag - 검사할 해시태그 문자열
 * @returns boolean - 유효하면 true, 아니면 false
 * ---------------------------------------------------------------------------
 */
export function isValidTag(tag: string) {
  return /^[\w가-힣]+$/.test(tag);
}