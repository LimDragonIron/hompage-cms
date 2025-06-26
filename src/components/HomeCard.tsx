import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from "react";

/**
 * HomeCard 컴포넌트
 * ----------------------------------------------------------------------------
 * 대시보드/홈 화면 등에서 사용되는, 아이콘+제목+설명으로 구성된 카드형 버튼 컴포넌트입니다.
 * 배경 그라데이션/텍스트 색상, 아이콘, 클릭 핸들러, 설명 등을 자유롭게 지정할 수 있습니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {ReactNode} props.icon - 카드 상단의 아이콘 요소(React 컴포넌트 등)
 * @param {string} props.title - 카드 제목
 * @param {string} props.description - 카드 설명(보조 텍스트)
 * @param {string} [props.accentColor] - 카드 배경 그라데이션 클래스(tailwind), 선택사항, 기본 회색 계열
 * @param {string} [props.textColor] - 텍스트 색상 클래스(tailwind), 선택사항, 기본 진한 검정
 * @param {() => void} props.onClick - 카드 클릭 시 실행되는 핸들러
 *
 * @returns {JSX.Element} - 카드형 버튼 UI
 */
type HomeCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor?: string;
  textColor?: string;
  onClick: () => void;
};

export function HomeCard({
  icon,
  title,
  description,
  accentColor = "from-gray-200 to-gray-300",
  textColor = "text-gray-900",
  onClick
}: HomeCardProps) {
  return (
    <Card
      className={`
        transition-transform cursor-pointer hover:scale-105 shadow-md
        bg-gradient-to-br ${accentColor}
        ${textColor}
        border border-gray-200
      `}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="text-3xl">{icon}</div>
        <CardTitle className={`text-lg font-bold ${textColor}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm mt-1 ${textColor}`}>{description}</p>
      </CardContent>
    </Card>
  );
}