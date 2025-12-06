"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateQuoteStatus, deleteQuote, type QuoteStatus } from "@/features/quote/actions";
import { Trash2 } from "lucide-react";

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

type EpoxyOptions = {
  material?: string;
  finish?: string;
  color?: string;
  colorMixingFee?: boolean;
  selfLeveling?: boolean;
  floorCondition?: string;
  applicationMethod?: string;
  location?: string;
  // 신규 옵션
  floorQuality?: string;
  crackCondition?: string;
  antiSlip?: boolean;
  surfaceProtection?: boolean;
  photoUrls?: string[];
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string, photoUrls?: string[]) => {
    if (!confirm("정말 이 견적을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.")) {
      return;
    }

    setDeletingId(id);
    const result = await deleteQuote(id, photoUrls);

    if (result.success) {
      startTransition(() => {
        router.refresh();
      });
    } else {
      alert("삭제 실패: " + result.error);
    }
    setDeletingId(null);
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
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              작업
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
                          <div><span className="text-gray-500">마감재:</span> {(quote.options as EpoxyOptions).material || "-"}</div>
                          {(quote.options as EpoxyOptions).finish && (
                            <div><span className="text-gray-500">광택:</span> {(quote.options as EpoxyOptions).finish}</div>
                          )}
                          {(quote.options as EpoxyOptions).color && (
                            <div><span className="text-gray-500">색상:</span> {(quote.options as EpoxyOptions).color}</div>
                          )}

                          {/* 신규 옵션들 */}
                          {(quote.options as EpoxyOptions).floorQuality && (
                            <div><span className="text-gray-500">바닥 상태:</span> {(quote.options as EpoxyOptions).floorQuality}</div>
                          )}
                          {(quote.options as EpoxyOptions).crackCondition && (
                            <div><span className="text-gray-500">균열 정도:</span> {(quote.options as EpoxyOptions).crackCondition}</div>
                          )}
                          {(quote.options as EpoxyOptions).antiSlip && (
                            <div><span className="text-gray-500">추가 옵션:</span> 미끄럼 방지 처리</div>
                          )}
                          {(quote.options as EpoxyOptions).surfaceProtection && (
                            <div><span className="text-gray-500">추가 옵션:</span> 표면 보호막</div>
                          )}

                          {(quote.options as EpoxyOptions).floorCondition && (
                            <div><span className="text-gray-500">바닥:</span> {(quote.options as EpoxyOptions).floorCondition}</div>
                          )}
                          {(quote.options as EpoxyOptions).selfLeveling && (
                            <div><span className="text-gray-500">셀프레벨링:</span> 포함</div>
                          )}
                          {(quote.options as EpoxyOptions).location && (
                            <div><span className="text-gray-500">장소:</span> {(quote.options as EpoxyOptions).location}</div>
                          )}

                          {/* 사진 표시 */}
                          {(quote.options as EpoxyOptions).photoUrls && (quote.options as EpoxyOptions).photoUrls!.length > 0 && (
                            <div className="mt-2">
                              <span className="text-gray-500">바닥 사진:</span>
                              <div className="flex gap-1 mt-1">
                                {(quote.options as EpoxyOptions).photoUrls!.map((url, idx) => (
                                  <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-16 h-16 rounded border border-gray-300 overflow-hidden hover:ring-2 hover:ring-primary"
                                  >
                                    <img src={url} alt={`사진 ${idx + 1}`} className="w-full h-full object-cover" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
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
              <td className="px-4 py-3 text-sm">
                <button
                  onClick={() => handleDelete(
                    quote.id,
                    (quote.options as EpoxyOptions)?.photoUrls
                  )}
                  disabled={deletingId === quote.id || isPending}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="삭제"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
