import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchContact } from "@/api/contact";
import type { Contact } from "@/types/contact";

export function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchContact(Number(id))
      .then(setContact)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!contact) return <div className="p-8 text-center">문의 내역을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <button
        className="mb-2 text-blue-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← 목록으로
      </button>
      <div className="bg-white rounded shadow p-4">
        <div className="mb-2 text-xs text-gray-500">문의번호 #{contact.id}</div>
        <div className="font-bold text-xl mb-2">{contact.title}</div>
        <div className="mb-1 text-sm text-gray-600">이메일: {contact.email}</div>
        <div className="mb-2 text-xs text-gray-400">
          작성일: {new Date(contact.createdAt).toLocaleString()}
        </div>
        <div className="border-t pt-4 whitespace-pre-wrap">{contact.content}</div>
      </div>
    </div>
  );
}