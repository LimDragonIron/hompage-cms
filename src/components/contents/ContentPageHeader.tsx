import React from "react";

/**
 * ContentPageHeader 컴포넌트
 * ----------------------------------------------------------------------------
 * 콘텐츠 관리 페이지(뉴스/히어로/배너 등)에서 상단에 사용하는 공통 헤더 컴포넌트입니다.
 * 페이지 제목, 우측 액션 버튼 영역, 필터 영역(검색/조건 등)을 제공합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.title - 상단 제목 텍스트
 * @param {React.ReactNode} [props.filter] - 제목 아래에 표시할 필터 컴포넌트(옵션)
 * @param {React.ReactNode} [props.actionArea] - 우측 상단에 표시할 액션 버튼/컴포넌트(옵션)
 *
 * @returns {JSX.Element} - 페이지 헤더 UI
 */
type ContentPageHeaderProps = {
  title: string;
  filter?: React.ReactNode;
  actionArea?: React.ReactNode;
};

export function ContentPageHeader({ title, filter, actionArea }: ContentPageHeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-center sm:text-left flex-1">{title}</h2>
        {actionArea && <div className="flex gap-2 w-full sm:w-auto">{actionArea}</div>}
      </div>
      {/* filter 영역: 항상 같은 높이로 유지 */}
      <div style={{ minHeight: 40, marginTop: 8 }}>
        {filter ? filter : <div style={{ height: 40 }} />}
      </div>
    </div>
  );
}