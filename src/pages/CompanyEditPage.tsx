import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompany, createCompany, updateCompany } from "@/api/company";
import type { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/**
 * Company 정보 편집/생성 페이지
 * - 최초엔 생성, 이미 있으면 수정만 가능
 * - 회사명(name)도 수정 가능하도록 구현
 */
export function CompanyEditPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 state
  const [name, setName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  // 최초 회사 정보 가져오기
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCompany();
        setCompany(data);
        setName(data?.name || "");
        setPostalCode(data?.postalCode || "");
        setAddress(data?.address || "");
        setAddressDetail(data?.addressDetail || "");
        setPhone(data?.phone || "");
        setEmail(data?.email || "");
      } catch (e: any) {
        setCompany(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 저장 핸들러 (생성 or 수정)
  const handleSave = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!name.trim()) throw new Error("회사명을 입력해주세요.");
      const payload = {
        name: name.trim(),
        postalCode: postalCode.trim() || undefined,
        address: address.trim() || undefined,
        addressDetail: addressDetail.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      };
      let result: Company;
      if (!company) {
        result = await createCompany(payload);
        alert("회사 정보가 생성되었습니다.");
      } else {
        result = await updateCompany(payload); // name 포함 가능!
        alert("회사 정보가 수정되었습니다.");
      }
      setCompany(result);
      setName(result.name || "");
      setPostalCode(result.postalCode || "");
      setAddress(result.address || "");
      setAddressDetail(result.addressDetail || "");
      setPhone(result.phone || "");
      setEmail(result.email || "");
    } catch (e: any) {
      setError(e.message || "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;

  return (
    <div className="p-4 sm:p-8 max-w-full sm:max-w-lg md:max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            회사 정보 {company ? "수정" : "생성"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">회사명 <span className="text-red-500">*</span></label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={saving}
                maxLength={100}
                required
                placeholder="회사명"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">우편번호</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                disabled={saving}
                maxLength={20}
                placeholder="우편번호"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">주소</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={address}
                onChange={e => setAddress(e.target.value)}
                disabled={saving}
                maxLength={255}
                placeholder="주소"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">상세주소</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={addressDetail}
                onChange={e => setAddressDetail(e.target.value)}
                disabled={saving}
                maxLength={255}
                placeholder="상세주소"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">연락처</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={saving}
                maxLength={20}
                placeholder="연락처"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">이메일</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={saving}
                maxLength={100}
                type="email"
                placeholder="이메일"
              />
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <div className="flex gap-2 mt-6">
              <Button
                type="submit"
                variant="default"
                disabled={saving || !name.trim()}
                className="w-full sm:w-auto"
              >
                {company ? "수정" : "생성"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={saving}
                className="w-full sm:w-auto"
              >
                돌아가기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}