"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateQuoteStatus, type QuoteStatus } from "@/features/quote/actions";

type Quote = {
  id: string;
  created_at: string;
  service_type: string;
  area: number;
  total_cost: number;
  contact_name: string;
  contact_phone: string;
  notes: string | null;
  status: QuoteStatus;
  options: Record<string, unknown>;
};

const STATUS_LABELS: Record<QuoteStatus, string> = {
  pending: "대기",
  confirmed: "확정",
  completed: "완료",
  cancelled: "취소",
};

const STATUS_COLORS: Record<QuoteStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-500",
};

const SERVICE_LABELS: Record<string, string> = {
  lane: "차선",
  epoxy: "에폭시",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

export function QuotesTable({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: QuoteStatus) => {
    setUpdatingId(id);
    const result = await updateQuoteStatus(id, newStatus);

    if (result.success) {
      startTransition(() => {
        router.refresh();
      });
    } else {
      alert("상태 변경 실패: " + result.error);
    }
    setUpdatingId(null);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              접수일시
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              서비스
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              면적
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              예상 견적
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              연락처
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              요청사항
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              상태
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {quotes.map((quote) => (
            <tr key={quote.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">
                {formatDate(quote.created_at)}
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                  {SERVICE_LABELS[quote.service_type] || quote.service_type}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {quote.area} m²
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {formatPrice(quote.total_cost)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                <div>{quote.contact_name || "-"}</div>
                <div className="text-gray-500">{quote.contact_phone}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 max-w-md">
                <div className="space-y-2">
                  {/* options 표시 */}
                  {quote.options && Object.keys(quote.options).length > 0 && (
                    <div className="text-xs bg-blue-50 p-2 rounded">
                      {quote.service_type === "lane" ? (
                        <>
                          <div><span className="text-gray-500">작업:</span> {(quote.options as { workType?: string }).workType === "new" ? "신규 도색" : "기존 덧칠"}</div>
                          <div><span className="text-gray-500">위치:</span> {(quote.options as { locationType?: string }).locationType === "ground" ? "지상" : "지하"}</div>
                          <div><span className="text-gray-500">주소:</span> {(quote.options as { address?: string }).address || "-"}</div>
                          {(quote.options as { parkingData?: { regularSpots: number; disabledSpots: number; evChargingSpots: number } }).parkingData && (
                            <div><span className="text-gray-500">주차:</span> 일반 {(quote.options as { parkingData: { regularSpots: number } }).parkingData.regularSpots}대, 장애인 {(quote.options as { parkingData: { disabledSpots: number } }).parkingData.disabledSpots}대, 전기차 {(quote.options as { parkingData: { evChargingSpots: number } }).parkingData.evChargingSpots}대</div>
                          )}
                        </>
                      ) : (
                        <>
                          <div><span className="text-gray-500">마감재:</span> {(quote.options as { material?: string }).material || "-"}</div>
                          {(quote.options as { finish?: string }).finish && <div><span className="text-gray-500">광택:</span> {(quote.options as { finish?: string }).finish}</div>}
                          {(quote.options as { color?: string }).color && <div><span className="text-gray-500">색상:</span> {(quote.options as { color?: string }).color}</div>}
                          {(quote.options as { floorCondition?: string }).floorCondition && <div><span className="text-gray-500">바닥:</span> {(quote.options as { floorCondition?: string }).floorCondition}</div>}
                          {(quote.options as { selfLeveling?: boolean }).selfLeveling && <div><span className="text-gray-500">셀프레벨링:</span> 포함</div>}
                          {(quote.options as { location?: string }).location && <div><span className="text-gray-500">장소:</span> {(quote.options as { location?: string }).location}</div>}
                        </>
                      )}
                    </div>
                  )}
                  {/* notes 표시 */}
                  {quote.notes && (
                    <div className="text-xs bg-gray-50 p-2 rounded">
                      <span className="text-gray-500">메모:</span> {quote.notes}
                    </div>
                  )}
                  {!quote.options && !quote.notes && <span className="text-gray-400">-</span>}
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                <select
                  value={quote.status || "pending"}
                  onChange={(e) => handleStatusChange(quote.id, e.target.value as QuoteStatus)}
                  disabled={updatingId === quote.id || isPending}
                  className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${
                    STATUS_COLORS[quote.status || "pending"]
                  } ${updatingId === quote.id ? "opacity-50" : ""}`}
                >
                  {(Object.entries(STATUS_LABELS) as [QuoteStatus, string][]).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
