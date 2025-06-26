import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * OrderInputExtraContent 컴포넌트
 * ----------------------------------------------------------------------------
 * 리스트 항목 우측에 "순서 직접 입력/적용" 기능을 제공하는 부가 컴포넌트입니다.
 * 사용자가 직접 숫자를 입력해 항목 순서를 변경할 수 있습니다.
 * 유효성 검사(0~최대-1), 처리 결과 메시지, 비동기 처리(로딩) 지원.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {number} props.itemId - 순서를 지정할 항목의 고유 id
 * @param {number} props.currentMax - 입력 가능한 최대 순서값(미만, 0~currentMax-1)
 * @param {(itemId: number, newOrder: number) => Promise<void>} props.onOrderUpdate - 순서 변경 비동기 함수
 * @param {() => void} [props.onSuccess] - 순서 변경 성공 후 호출할 콜백(옵션)
 *
 * @returns {JSX.Element} - 순서 입력 및 적용 UI
 */
type Props = {
  itemId: number;
  currentMax: number;
  onOrderUpdate: (itemId: number, newOrder: number) => Promise<void>;
  onSuccess?: () => void;
};

export function OrderInputExtraContent({ itemId, currentMax, onOrderUpdate, onSuccess }: Props) {
  const [orderInput, setOrderInput] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleApply = async () => {
    const newOrder = Number(orderInput);
    if (isNaN(newOrder) || newOrder < 0 || newOrder >= currentMax) {
      setMsg(`0~${currentMax - 1} 사이의 값을 입력`);
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      await onOrderUpdate(itemId, newOrder);
      setMsg("변경 완료");
      setOrderInput("");
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setMsg(e?.message ?? "순서 변경 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center gap-2 min-w-[170px]">
      <label htmlFor={`order-input-${itemId}`} className="text-sm text-gray-600 font-medium">
        순서
      </label>
      <input
        id={`order-input-${itemId}`}
        type="number"
        min={0}
        max={currentMax - 1}
        value={orderInput}
        disabled={loading}
        onChange={e => setOrderInput(e.target.value)}
        className="h-8 w-16 px-2 rounded border border-gray-300 text-sm align-middle focus:outline-none focus:ring-2 focus:ring-blue-200"
        placeholder={`0~${currentMax - 1}`}
        aria-label="새 순서"
      />
      <Button
        variant="outline"
        size="sm"
        disabled={loading || orderInput === ""}
        onClick={handleApply}
        className="h-8 px-3 align-middle"
      >
        순서 적용
      </Button>
      <span
        className={`absolute left-0 -bottom-5 text-xs min-h-[1.2em] ${
          msg === "변경 완료" ? "text-green-600" : "text-red-500"
        }`}
      >
        {msg}
      </span>
    </div>
  );
}