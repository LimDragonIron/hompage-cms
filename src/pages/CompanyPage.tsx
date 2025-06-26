import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompany } from "@/api/company";
import type { Company } from "@/types";
import { ContentPageHeader } from "@/components/contents/ContentPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaPlus, FaEdit } from "react-icons/fa";

export function CompanyPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchCompany();
        setCompany(data);
      } catch (e) {
        setCompany(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = () => {
    navigate("/company/edit");
  };

  const handleEdit = () => {
    navigate("/company/edit");
  };

  // 상단 header 버튼: 정보 있으면 "수정", 없으면 "등록"
  const actionArea = (
    <>
      {company ? (
        <Button variant="secondary" onClick={handleEdit}>
          <FaEdit className="mr-2" /> 회사 정보 수정
        </Button>
      ) : (
        <Button variant="default" onClick={handleCreate}>
          <FaPlus className="mr-2" /> 회사 정보 등록
        </Button>
      )}
    </>
  );

  return (
    <div className="p-2 sm:p-6 md:p-8 max-w-full sm:max-w-3xl mx-auto">
      <ContentPageHeader
        title="회사 정보"
        actionArea={actionArea}
      />
      <Card>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">로딩 중...</div>
          ) : company ? (
            <div className="space-y-3 py-2">
              <div>
                <span className="font-semibold">회사명: </span>{company.name}
              </div>
              {company.postalCode && (
                <div>
                  <span className="font-semibold">우편번호: </span>{company.postalCode}
                </div>
              )}
              {company.address && (
                <div>
                  <span className="font-semibold">주소: </span>{company.address}
                </div>
              )}
              {company.addressDetail && (
                <div>
                  <span className="font-semibold">상세주소: </span>{company.addressDetail}
                </div>
              )}
              {company.phone && (
                <div>
                  <span className="font-semibold">연락처: </span>{company.phone}
                </div>
              )}
              {company.email && (
                <div>
                  <span className="font-semibold">이메일: </span>{company.email}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              등록된 회사 정보가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}