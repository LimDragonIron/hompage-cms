import type { UploadedFileResult, UploadFileDto } from "@/types";
import API from "./axiosInstance";
import type { ResponseBuilder } from "@/types/response";

/**
 * 파일(이미지) 업로드 관련 API 함수
 * ----------------------------------------------------------------------------
 * uploadImage(file, context): 이미지 파일을 업로드합니다.
 *   - file: 업로드할 File 객체
 *   - context: { contentId, contentType } 등 업로드 대상 정보
 *   - contentId가 유효하지 않거나 contentType이 없을 경우 에러를 throw합니다.
 *   - 업로드 성공 시 서버에서 반환한 UploadedFileResult를 반환합니다.
 *   - 업로드 실패 시(응답 code !== "SUCCESS" 또는 data 없음) 에러를 throw합니다.
 *
 * @param {File} file - 업로드할 파일 객체
 * @param {UploadFileDto} context - 업로드 컨텍스트 (contentId, contentType 등)
 * @returns {Promise<UploadedFileResult>} - 업로드 결과
 * @throws {Error} contentId 또는 contentType이 유효하지 않을 때, 업로드 실패 시
 */
export async function uploadImage(
  file: File,
  context: UploadFileDto
): Promise<UploadedFileResult> {
  const formData = new FormData();
  formData.append("file", file);

  if (
    context.contentId === undefined ||
    context.contentId === null ||
    isNaN(Number(context.contentId))
  ) {
    throw new Error("contentId가 유효하지 않습니다.");
  }
  if (!context.contentType) {
    throw new Error("contentType이 유효하지 않습니다.");
  }
  formData.append("contentType", context.contentType);
  formData.append("contentId", String(context.contentId));

  const res = await API.post<ResponseBuilder<UploadedFileResult>>(
    "/uploadfile/media",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  if (res.data.code !== "SUCCESS" || !res.data.data) {
    throw new Error(res.data.message || "파일 업로드 실패");
  }
  return res.data.data;
}