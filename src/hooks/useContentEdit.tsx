import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useContentEdit 커스텀 훅
 * ---------------------------------------------------------------------------
 * 단일 콘텐츠(뉴스/배너/게임 등)의 "상세 조회 및 수정" 화면에서 사용하는 공통 훅입니다.
 * 데이터 조회, 수정, 변경 감지, 원본 동기화 등 편집 로직을 통합 관리합니다.
 *
 * [제네릭 타입 T]
 * - 관리하려는 콘텐츠 데이터 타입(예: News, Banner 등)
 *
 * @template T - 콘텐츠 데이터 제네릭 타입
 *
 * @param {Object} args - 훅 파라미터 객체
 * @param {string|undefined} args.id - 편집할 콘텐츠의 식별자(라우트 파라미터 등)
 * @param {(id: number) => Promise<T>} args.fetchFn - 콘텐츠 상세 조회 비동기 함수
 * @param {(id: number, payload: Partial<T>) => Promise<T>} args.updateFn - 콘텐츠 수정(저장) 비동기 함수
 * @param {(data: T) => { title: string; content: string; imageUrl?: string | null }} args.fields - 데이터에서 타이틀, 내용, 이미지 추출 함수 (useCallback으로 감싸서 전달 권장)
 * @param {(args: { title: string; content: string }) => Partial<T>} [args.buildUpdatePayload] - 저장 시 payload를 커스터마이즈하는 함수(선택)
 *
 * @returns {Object} 반환 객체
 * @returns {T|null} data - 전체 데이터 원본
 * @returns {boolean} loading - 로딩 중 여부
 * @returns {string} title - 타이틀
 * @returns {(v: string) => void} setTitle - 타이틀 setter
 * @returns {string} content - 내용
 * @returns {(v: string) => void} setContent - 내용 setter
 * @returns {string|null} imageUrl - 이미지 URL(있을 경우)
 * @returns {boolean} saving - 저장(수정) 진행 중 여부
 * @returns {boolean} hasChanges - 타이틀/내용 변경 감지
 * @returns {(event?: React.FormEvent) => Promise<void>} handleSave - 저장(수정) 핸들러(Form 이벤트 대응)
 * @returns {() => void} clearChanges - 변경 감지 상태/원본 초기화 함수
 * ---------------------------------------------------------------------------
 */
type UseContentEditArgs<T> = {
  /** 편집할 콘텐츠의 식별자(라우트 파라미터 등) */
  id: string | undefined;
  /** 콘텐츠 상세 조회 함수(비동기) */
  fetchFn: (id: number) => Promise<T>;
  /** 콘텐츠 수정(저장) 함수(비동기) */
  updateFn: (id: number, payload: Partial<T>) => Promise<T>;
  /**
   * 콘텐츠 데이터에서 타이틀, 내용, 이미지 추출 함수
   * @param data - 원본 데이터
   * @returns { title: string; content: string; imageUrl?: string | null }
   */
  fields: (data: T) => { title: string; content: string; imageUrl?: string | null };
  /**
   * 저장 시 보낼 payload를 커스터마이즈하는 함수(선택)
   * @param args - { title, content }
   * @returns Partial<T>
   */
  buildUpdatePayload?: (args: { title: string; content: string }) => Partial<T>;
};

export function useContentEdit<T>({
  id,
  fetchFn,
  updateFn,
  fields,
  buildUpdatePayload
}: UseContentEditArgs<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // 원본(title, content) 값 저장
  const original = useRef({ title: "", content: "" });

  /** 변경 감지 상태 관리 */
  const [hasChanges, setHasChanges] = useState(false);

  /**
   * 변경 감지 상태 초기화 및 원본 동기화
   */
  const clearChanges = useCallback(() => {
    setHasChanges(false);
    original.current = { title, content };
  }, [title, content]);

  // 데이터 fetch 및 상태 초기화
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        if (!id) throw new Error("잘못된 접근입니다.");
        const fetched = await fetchFn(Number(id));
        if (ignore) return;
        setData(fetched);
        const { title, content, imageUrl } = fields(fetched);
        setTitle(title || "");
        setContent(content || "");
        setImageUrl(imageUrl || null);
        original.current = { title: title || "", content: content || "" };
        setHasChanges(false);
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id, fetchFn, fields]); // fields는 반드시 useCallback으로 감싸서 넘길 것!

  // 타이틀/내용이 바뀔 때마다 변경 감지 자동 체크
  useEffect(() => {
    setHasChanges(title !== original.current.title || content !== original.current.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  /**
   * 저장(수정) 핸들러
   * @param {React.FormEvent} [event] - 폼 이벤트(옵션)
   */
  const handleSave = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setSaving(true);
    try {
      if (!id) throw new Error("잘못된 접근입니다.");
      const payload =
        buildUpdatePayload?.({ title, content }) ?? ({} as Partial<T>);
      if (!buildUpdatePayload) {
        (payload as any).title = title;
        (payload as any).content = content;
      }
      const updated = await updateFn(Number(id), payload);
      setData(updated);
      original.current = { title, content };
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  return {
    data,
    loading,
    title,
    setTitle,
    content,
    setContent,
    imageUrl,
    saving,
    hasChanges,
    handleSave,
    clearChanges
  };
}