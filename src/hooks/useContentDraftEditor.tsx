import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type {
  UseContentDraftEditorOptions,
  HashtagsState,
  ExtraPayload,
} from "@/types";

// 자동 저장 debounce 시간(ms)
const AUTOSAVE_DEBOUNCE = 2000;

/**
 * useContentDraftEditor 커스텀 훅
 * ---------------------------------------------------------------------------
 * 뉴스/배너/게임 등 콘텐츠 작성/수정 페이지에서 "임시저장(드래프트)" 기능을 통합 관리하는 커스텀 훅입니다.
 * 제목, 내용, 해시태그, 플랫폼 링크, 이미지 파일 등 다양한 입력 필드를 관리하며,
 * 자동 임시저장, 이미지 업로드, 최종 등록, 취소(임시저장 삭제) 등의 기능을 제공합니다.
 *
 * [제네릭 타입 T]
 * - id, title, content, files, hashtags, platformLinks 등의 필드를 가진 콘텐츠 데이터 타입
 *
 * @template T - 콘텐츠 데이터 제네릭 타입
 *
 * @param {Object} options - 훅 파라미터 객체
 * @param {() => Promise<T>} options.createOrFetchDraft - 드래프트 생성/불러오기 함수(필수)
 * @param {(id: number, payload: any) => Promise<T>} options.updateDraft - 드래프트 임시저장(업데이트) 함수(필수)
 * @param {(id: number) => Promise<void>} options.completeDraft - 드래프트를 정식 등록(완료) 처리하는 함수(필수)
 * @param {(id: number) => Promise<void>} options.deleteDraft - 드래프트 삭제 함수(필수)
 * @param {(file: File, context?: any) => Promise<{ id: number; url: string }>} options.uploadImageApi - 이미지 파일 업로드 함수(필수)
 * @param {string} options.afterCompleteNavigate - 등록 완료 후 이동할 라우트(필수)
 * @param {string} options.afterCancelNavigate - 취소/삭제 후 이동할 라우트(필수)
 * @param {Partial<T>} options.initialState - 초기값(제목/내용/해시태그 등)
 * @param {boolean} [options.useTag=false] - 해시태그 사용 여부(기본 false)
 * @param {boolean} [options.usePlatformLinks=false] - 플랫폼 링크 사용 여부(기본 false)
 * @param {(params: { title: string; content: string; hashtags?: string[]; platformLinks?: { platform: string; link: string }[]; fileId?: number; [key: string]: any }) => any} [options.buildUpdatePayload] - 드래프트 업데이트 시 payload 구조를 커스터마이즈하는 함수(선택)
 *
 * @returns {Object} 반환 객체
 * @returns {string} title - 제목
 * @returns {(v: string) => void} setTitle - 제목 setter
 * @returns {string} content - 내용
 * @returns {(v: string) => void} setContent - 내용 setter
 * @returns {HashtagsState} hashtags - 해시태그 배열
 * @returns {(v: HashtagsState) => void} setHashtags - 해시태그 setter
 * @returns {{ platform: string; link: string }[]} platformLinks - 플랫폼 링크 배열
 * @returns {(v: { platform: string; link: string }[]) => void} setPlatformLinks - 플랫폼 링크 setter
 * @returns {number|undefined} fileId - 첨부 이미지 파일 id
 * @returns {(v: number | undefined) => void} setFileId - 첨부 파일 id setter
 * @returns {string|null} imagePreview - 업로드 중 프리뷰 이미지 URL
 * @returns {(v: string|null) => void} setImagePreview - 프리뷰 setter
 * @returns {string|null} currentImageUrl - 현재 저장된 이미지 URL
 * @returns {(v: string|null) => void} setCurrentImageUrl - 저장 이미지 URL setter
 * @returns {boolean} uploading - 이미지 업로드 중 상태
 * @returns {number|null} draftId - 현재 드래프트 id
 * @returns {boolean} loadingDraft - 드래프트 로딩 중 여부
 * @returns {(e: React.ChangeEvent<HTMLInputElement>, context?: any) => Promise<void>} handleFileChange - 파일 업로드 핸들러
 * @returns {(validateFn?: () => string | undefined) => Promise<void>} handleComplete - 등록/완료 핸들러
 * @returns {() => Promise<void>} handleCancel - 취소/삭제 핸들러
 * @returns {(extra?: ExtraPayload) => void} autoSave - 자동 저장 트리거
 * @returns {Object} draft - 통합 draft 객체 (id, title, content, hashtags, platformLinks, fileId, files)
 * ---------------------------------------------------------------------------
 */
export function useContentDraftEditor<T extends {
  id: number;
  title?: string;
  content?: string;
  files?: any[];
  hashtags?: string[];
  platformLinks?: { platform: string; link: string }[];
}>(
  options: UseContentDraftEditorOptions<T> & {
    buildUpdatePayload?: (params: {
      title: string;
      content: string;
      hashtags?: string[];
      platformLinks?: { platform: string; link: string }[];
      fileId?: number;
      [key: string]: any;
    }) => any;
  }
) {
  const {
    createOrFetchDraft,
    updateDraft,
    completeDraft,
    deleteDraft,
    uploadImageApi,
    afterCompleteNavigate,
    afterCancelNavigate,
    initialState,
    useTag = false,
    usePlatformLinks = false,
    buildUpdatePayload,
  } = options;

  const navigate = useNavigate();

  // 기본 상태 정의
  const [title, setTitle] = useState(initialState.title ?? "");
  const [content, setContent] = useState(initialState.content ?? "");
  const [hashtags, setHashtags] = useState<HashtagsState>(initialState.hashtags ?? []);
  const [platformLinks, setPlatformLinks] = useState<{ platform: string; link: string }[]>(initialState.platformLinks ?? []);
  const [fileId, setFileId] = useState<number | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);

  // Debounce timeout ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Last autosave params to avoid unnecessary API call for same state
  const lastSavedRef = useRef<{
    title: string;
    content: string;
    hashtags: string[];
    platformLinks: { platform: string; link: string }[];
    fileId?: number;
  } | null>(null);

  // 최초 마운트 시 draft 생성 or 불러오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingDraft(true);
      try {
        const draft = await createOrFetchDraft();
        if (!mounted) return;
        setDraftId(draft.id);
        setTitle(draft.title ?? "");
        setContent(draft.content ?? "");
        if (useTag) setHashtags(draft.hashtags ?? []);
        if (usePlatformLinks) setPlatformLinks(draft.platformLinks ?? []);
        const firstFile = draft.files && draft.files.length > 0 ? draft.files[0] : undefined;
        setFileId(firstFile?.id);
        setCurrentImageUrl(firstFile?.url ?? null);
        lastSavedRef.current = {
          title: draft.title ?? "",
          content: draft.content ?? "",
          hashtags: draft.hashtags ?? [],
          platformLinks: draft.platformLinks ?? [],
          fileId: firstFile?.id,
        };
      } catch (e: any) {
        alert(e.message || "임시저장 불러오기 실패");
        navigate(afterCancelNavigate);
      } finally {
        setLoadingDraft(false);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line
  }, []);

  /**
   * draftId가 없으면 서버에서 draft를 반드시 생성해서 id 반환
   * @returns {Promise<number>} draftId
   */
  const ensureDraftId = useCallback(async () => {
    if (draftId) return draftId;
    setLoadingDraft(true);
    try {
      const draft = await createOrFetchDraft();
      setDraftId(draft.id);
      setTitle(draft.title ?? "");
      setContent(draft.content ?? "");
      if (useTag) setHashtags(draft.hashtags ?? []);
      if (usePlatformLinks) setPlatformLinks(draft.platformLinks ?? []);
      const firstFile = draft.files && draft.files.length > 0 ? draft.files[0] : undefined;
      setFileId(firstFile?.id);
      setCurrentImageUrl(firstFile?.url ?? null);
      lastSavedRef.current = {
        title: draft.title ?? "",
        content: draft.content ?? "",
        hashtags: draft.hashtags ?? [],
        platformLinks: draft.platformLinks ?? [],
        fileId: firstFile?.id,
      };
      return draft.id;
    } finally {
      setLoadingDraft(false);
    }
  }, [draftId, createOrFetchDraft, useTag, usePlatformLinks]);

  /**
   * 자동 저장(변경사항이 있을 때만 debounce로 저장)
   * @param {ExtraPayload} [extra] - 추가로 저장할 payload
   */
  const autoSave = useCallback(
    (extra?: ExtraPayload) => {
      if (!draftId) return;
      const hashtagsToSave = useTag ? hashtags : [];
      const platformLinksToSave = usePlatformLinks ? platformLinks : [];
      let savePayload: any = {
        title,
        content,
        ...(useTag && { hashtags: hashtagsToSave }),
        ...(usePlatformLinks && { platformLinks: platformLinksToSave }),
        ...(extra || {}),
      };
      if (buildUpdatePayload) {
        savePayload = buildUpdatePayload({
          title,
          content,
          hashtags: hashtagsToSave,
          platformLinks: platformLinksToSave,
          ...extra,
        });
      }
      const last = lastSavedRef.current;
      const isSame =
        last &&
        last.title === savePayload.title &&
        last.content === savePayload.content &&
        JSON.stringify(last.hashtags) === JSON.stringify(savePayload.hashtags ?? []) &&
        JSON.stringify(last.platformLinks) === JSON.stringify(savePayload.platformLinks ?? []) &&
        last.fileId === savePayload.fileId;
      if (isSame) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          const updated = await updateDraft(draftId, savePayload);
          if (useTag && updated.hashtags) setHashtags(updated.hashtags);
          if (usePlatformLinks && updated.platformLinks) setPlatformLinks(updated.platformLinks);
          lastSavedRef.current = {
            title: savePayload.title,
            content: savePayload.content,
            hashtags: savePayload.hashtags ?? [],
            platformLinks: savePayload.platformLinks ?? [],
            fileId: savePayload.fileId,
          };
        } catch (e) {
          // 무시
        }
      }, AUTOSAVE_DEBOUNCE);
    },
    [draftId, title, content, hashtags, platformLinks, updateDraft, useTag, usePlatformLinks, buildUpdatePayload]
  );

  /**
   * 이미지 업로드(드래프트 id가 없으면 먼저 생성 후 진행)
   * @param {React.ChangeEvent<HTMLInputElement>} e - 파일 input change 이벤트
   * @param {any} [context] - 업로드 컨텍스트(선택)
   */
  const handleFileChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      context?: any
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        let id = draftId;
        if (!id) {
          id = await ensureDraftId();
        }
        // context에 contentId가 없거나 잘못 들어올 수 있으니 확실히 덮어씌움
        const uploadContext = { ...(context || {}), contentId: id };
        const uploaded = await uploadImageApi(file, uploadContext);
        setFileId(uploaded.id);
        setImagePreview(URL.createObjectURL(file));
        setCurrentImageUrl(uploaded.url);
        autoSave({ fileId: uploaded.id });
      } catch (err: any) {
        alert(err.message || "이미지 업로드 실패");
      } finally {
        setUploading(false);
      }
    },
    [uploadImageApi, autoSave, draftId, ensureDraftId]
  );

  /**
   * 완료(정식 등록)
   * @param {() => string | undefined} [validateFn] - 입력 검증 함수(에러 메시지 반환 시 중단)
   */
  const handleComplete = useCallback(async (validateFn?: () => string | undefined) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (validateFn) {
      const msg = validateFn();
      if (msg) {
        alert(msg);
        return;
      }
    }
    if (!draftId) return;
    try {
      await completeDraft(draftId);
      navigate(afterCompleteNavigate);
    } catch (e: any) {
      alert(e.message || "정식 등록 실패");
    }
  }, [completeDraft, draftId, afterCompleteNavigate, navigate]);

  /**
   * 취소(임시저장 삭제)
   */
  const handleCancel = useCallback(async () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!draftId) {
      navigate(afterCancelNavigate);
      return;
    }
    if (!window.confirm("임시저장을 삭제하고 나가시겠습니까?")) return;
    try {
      await deleteDraft(draftId);
      navigate(afterCancelNavigate);
    } catch (e: any) {
      alert(e.message || "임시저장 삭제 실패");
    }
  }, [draftId, deleteDraft, afterCancelNavigate, navigate]);

  return {
    title, setTitle,
    content, setContent,
    hashtags, setHashtags,
    platformLinks, setPlatformLinks,
    fileId, setFileId,
    imagePreview, setImagePreview,
    currentImageUrl, setCurrentImageUrl,
    uploading, draftId, loadingDraft,
    handleFileChange,
    handleComplete,
    handleCancel,
    autoSave,
    draft: {
      id: draftId,
      title,
      content,
      hashtags,
      platformLinks,
      fileId,
      files: [], // 실제 파일 목록 필요시 확장
    },
  };
}