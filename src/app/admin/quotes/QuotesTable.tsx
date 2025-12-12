"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateQuoteStatus, updateQuoteAssignment, deleteQuote, type QuoteStatus } from "@/features/quote/actions";
import { Trash2, Building2, UserCheck, Banknote } from "lucide-react";

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
  // New columns
  assignment_type?: 'direct' | 'brokerage' | 'pending';
  brokerage_memo?: string;
  commission?: number;
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
  isSimpleLead?: boolean; // 간편 견적 여부
};

const STATUS_LABELS: Record<QuoteStatus, string> = {
  pending: "대기",
  confirmed: "진행중",
  completed: "완료",
  cancelled: "취소",
};

const STATUS_COLORS: Record<QuoteStatus, string> = {
  pending: "bg-gray-100 text-gray-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-50 text-red-500",
};

const ASSIGNMENT_LABELS = {
  pending: "미배정",
  direct: "직영 시공",
  brokerage: "중개 매칭",
};

const SERVICE_LABELS: Record<string, string> = {
  lane: "차선",
  epoxy: "에폭시",
  paint: "페인트",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR").format(price);
}

export function QuotesTable({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Modal State for Assignment
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [assignmentType, setAssignmentType] = useState<'direct' | 'brokerage'>('direct');
  const [brokerMemo, setBrokerMemo] = useState("");
  const [commission, setCommission] = useState("50000");

  const openAssignmentModal = (quote: Quote) => {
    setSelectedQuote(quote);
    setAssignmentType(quote.assignment_type === 'brokerage' ? 'brokerage' : 'direct');
    setBrokerMemo(quote.brokerage_memo || "");
    setCommission(quote.commission?.toString() || "50000");
  };

  const closeAssignmentModal = () => {
    setSelectedQuote(null);
  };

  const handleAssignmentSubmit = async () => {
    if (!selectedQuote) return;

    const result = await updateQuoteAssignment(selectedQuote.id, {
      assignment_type: assignmentType,
      brokerage_memo: assignmentType === 'brokerage' ? brokerMemo : undefined,
      commission: assignmentType === 'brokerage' ? parseInt(commission) : 0,
      status: 'confirmed', // 배정하면 자동으로 진행중 상태로 변경
    });

    if (result.success) {
      startTransition(() => {
        router.refresh();
      });
      closeAssignmentModal();
    } else {
      alert("업데이트 실패: " + result.error);
    }
  };

  const handleDelete = async (id: string, photoUrls?: string[]) => {
    if (!confirm("정말 이 견적을 삭제하시겠습니까?\n 삭제된 데이터는 복구할 수 없습니다.")) {
      return;
    }
    const result = await deleteQuote(id, photoUrls);
    if (result.success) {
      startTransition(() => {
        router.refresh();
      });
    } else {
      alert("삭제 실패: " + result.error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">접수</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">내용</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">견적가</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">고객정보</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">배정 관리</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50">
                {/* 1. 접수일시 */}
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(quote.created_at)}
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLORS[quote.status]}`}>
                      {STATUS_LABELS[quote.status]}
                    </span>
                  </div>
                </td>

                {/* 2. 내용 (서비스 + 면적 + 옵션요약) */}
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-900">
                    [{SERVICE_LABELS[quote.service_type] || quote.service_type}] {quote.area}m²
                  </div>
                  
                  {/* options 표시 */}
                  {quote.options && Object.keys(quote.options).length > 0 && (
                    <div className="text-xs bg-blue-50 p-2 rounded mt-1">
                      {(quote.options as any).isSimpleLead ? (
                         // 간편 문자 문의인 경우
                         <div className="flex items-start gap-2">
                           <span className="shrink-0 px-1.5 py-0.5 bg-green-500 text-white rounded font-bold text-[10px]">
                             간편문의
                           </span>
                           <div>
                             <div className="font-bold text-gray-700 mb-1">문자로 예상 견적 발송됨</div>
                             <div className="text-gray-600">
                               <span className="text-gray-400">지역:</span> {(quote.options as any).location}
                             </div>
                           </div>
                         </div>
                      ) : (
                        // 기존 상세 견적
                        quote.service_type === "lane" ? (
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
                          <div><span className="text-gray-700">마감재:</span> {(quote.options as EpoxyOptions).material || "-"}</div>
                          {(quote.options as EpoxyOptions).finish && (
                            <div><span className="text-gray-700">광택:</span> {(quote.options as EpoxyOptions).finish}</div>
                          )}
                          {(quote.options as EpoxyOptions).color && (
                            <div><span className="text-gray-700">색상:</span> {(quote.options as EpoxyOptions).color}</div>
                          )}

                          {/* 신규 옵션들 */}
                          {(quote.options as EpoxyOptions).floorQuality && (
                            <div><span className="text-gray-700">바닥 상태:</span> {(quote.options as EpoxyOptions).floorQuality}</div>
                          )}
                          {(quote.options as EpoxyOptions).crackCondition && (
                            <div><span className="text-gray-700">균열 정도:</span> {(quote.options as EpoxyOptions).crackCondition}</div>
                          )}
                          {(quote.options as EpoxyOptions).antiSlip && (
                            <div><span className="text-gray-700">추가 옵션:</span> 미끄럼 방지 처리</div>
                          )}
                          {(quote.options as EpoxyOptions).surfaceProtection && (
                            <div><span className="text-gray-700">추가 옵션:</span> 표면 보호막</div>
                          )}

                          {(quote.options as EpoxyOptions).floorCondition && (
                            <div><span className="text-gray-700">바닥:</span> {(quote.options as EpoxyOptions).floorCondition}</div>
                          )}
                          {(quote.options as EpoxyOptions).selfLeveling && (
                            <div><span className="text-gray-700">셀프레벨링:</span> 포함</div>
                          )}
                          {(quote.options as EpoxyOptions).location && (
                            <div><span className="text-gray-700">장소:</span> {(quote.options as EpoxyOptions).location}</div>
                          )}

                          {/* 사진 표시 */}
                          {(quote.options as EpoxyOptions).photoUrls && (quote.options as EpoxyOptions).photoUrls!.length > 0 && (
                            <div className="mt-2">
                              <span className="text-gray-700">바닥 사진:</span>
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
                      ))}
                    </div>
                  )}
                  
                  {/* Notes for simple lead (already displayed in options, so skip or simplify) */}
                  {!((quote.options as any).isSimpleLead) && quote.notes && (
                      <div className="text-xs bg-gray-50 p-2 rounded mt-1">
                          <span className="text-gray-500">메모:</span> {quote.notes}
                      </div>
                  )}
                </td>

                {/* 3. 견적가 */}
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  {formatPrice(quote.total_cost)}원
                </td>

                {/* 4. 고객정보 */}
                <td className="px-4 py-3 text-sm">
                  <div className="text-gray-900">{quote.contact_name}</div>
                  <div className="text-gray-500 text-xs">{quote.contact_phone}</div>
                </td>

                {/* 5. 배정 관리 (핵심) */}
                <td className="px-4 py-3">
                  {quote.assignment_type === 'brokerage' ? (
                     // 중개 배정된 경우
                     <div className="flex flex-col gap-1">
                       <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-medium w-fit">
                         <UserCheck size={12} /> 중개 매칭
                       </span>
                       <div className="text-xs text-gray-600 font-medium">{quote.brokerage_memo}</div>
                       <div className="text-xs text-green-600 flex items-center gap-1">
                         <Banknote size={10} /> +{formatPrice(quote.commission || 0)}
                       </div>
                       <button onClick={() => openAssignmentModal(quote)} className="text-[10px] text-gray-400 underline text-left">수정</button>
                     </div>
                  ) : quote.assignment_type === 'direct' ? (
                     // 직영 배정된 경우
                     <div className="flex flex-col gap-1">
                       <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium w-fit">
                         <Building2 size={12} /> 본사 직영
                       </span>
                       <button onClick={() => openAssignmentModal(quote)} className="text-[10px] text-gray-400 underline text-left">수정</button>
                     </div>
                  ) : (
                     // 미배정
                     <button
                       onClick={() => openAssignmentModal(quote)}
                       className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors shadow-sm"
                     >
                       배정하기
                     </button>
                  )}
                </td>

                {/* 6. 관리 (삭제) */}
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleDelete(quote.id, (quote.options as EpoxyOptions)?.photoUrls)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg">시공 배정 관리</h3>
              <button onClick={closeAssignmentModal} className="text-gray-500 hover:text-black">✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Type Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAssignmentType('direct')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${ assignmentType === 'direct' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  <Building2 size={24} />
                  <span className="font-bold">본사 직영</span>
                </button>
                <button
                  onClick={() => setAssignmentType('brokerage')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${ assignmentType === 'brokerage' 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  <UserCheck size={24} />
                  <span className="font-bold">업체 매칭 (중개)</span>
                </button>
              </div>

              {/* Brokerage Details */}
              {assignmentType === 'brokerage' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">배정 업체명 / 메모</label>
                    <input
                      type="text"
                      value={brokerMemo}
                      onChange={(e) => setBrokerMemo(e.target.value)}
                      placeholder="예: 김반장님, 경기남부 페인트"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">중개 수수료 (원)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={commission}
                        onChange={(e) => setCommission(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none text-right font-medium"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">원</span>
                    </div>
                  </div>
                </div>
              )}
              
              {assignmentType === 'direct' && (
                <p className="text-sm text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
                  본사 직영팀이 시공하는 건으로 설정합니다.<br/>
                  (수수료 0원 처리)
                </p>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              <button
                onClick={closeAssignmentModal}
                className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleAssignmentSubmit}
                className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
