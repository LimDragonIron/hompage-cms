import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchContacts } from "@/api/contact";
import type { Contact } from "@/types/contact";

export function ContactPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchContacts()
      .then(res => setContacts(res.items))
      .catch(e => setError(e.message || "문의 목록 조회 실패"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">문의 내역</h1>
      {loading && <div className="py-12 text-center">로딩 중...</div>}
      {error && <div className="text-red-500 py-8 text-center">{error}</div>}
      {!loading && !error && contacts.length === 0 && (
        <div className="py-12 text-center text-gray-500">등록된 문의가 없습니다.</div>
      )}
      {!loading && !error && contacts.length > 0 && (
        <ul className="divide-y border rounded bg-white shadow list-none p-0 m-0">
          {contacts.map(contact => (
            <li
              key={contact.id}
              className="p-4 hover:bg-blue-50 transition cursor-pointer"
              onClick={() => navigate(`/contacts/${contact.id}`)}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") navigate(`/contacts/${contact.id}`);
              }}
              role="button"
              aria-label={`문의 상세 ${contact.title}`}
            >
              <div className="font-semibold text-lg">{contact.title}</div>
              <div className="text-xs text-gray-500 mt-1">{contact.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}