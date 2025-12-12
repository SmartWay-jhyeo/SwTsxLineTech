"use client";

import { useState } from "react";
import { Loader2, X, CheckCircle2 } from "lucide-react";
import { submitQuote, type QuoteInput } from "@/features/quote/actions";
import { formatPrice } from "@/features/quote/utils/epoxyPriceCalculator";

type SimpleLeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  serviceType: "epoxy" | "lane" | "paint";
  area: number;
  priceRange: { min: number; max: number };
};

export function SimpleLeadModal({ isOpen, onClose, serviceType, area, priceRange }: SimpleLeadModalProps) {
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !region) return;

    setIsSubmitting(true);

    try {
      const avgPrice = Math.round((priceRange.min + priceRange.max) / 2);

      // 간편 견적 데이터 구성
      const leadData: any = {
        service_type: serviceType,
        area: area,
        contact_name: "간편문의 고객", // 이름은 받지 않으므로 임시 지정
        contact_phone: phone,
        notes: `[간편견적] 지역: ${region} / 예상가: ${formatPrice(priceRange.min)} ~ ${formatPrice(priceRange.max)}`,
        base_cost: avgPrice, // 통계용 평균값
        option_cost: 0,
        total_cost: avgPrice,
        status: 'pending',
        options: {
            location: region, // 지역 정보 저장
            isSimpleLead: true // 간편 견적 식별자
        }
      };
      
      // 필수값 채우기 (타입 맞추기용)
      if (serviceType === 'epoxy') {
        leadData.surface_condition = 'unknown';
        leadData.surcharge = 0;
        leadData.is_minimum_applied = false;
        leadData.options.material = '미지정';
        leadData.options.colorMixingFee = false;
        leadData.options.selfLeveling = false;
      } else if (serviceType === 'lane') {
        leadData.base_cost = avgPrice; 
        leadData.options.workType = 'new';
        leadData.options.locationType = 'ground';
        leadData.options.address = region;
        leadData.options.parkingData = { regularSpots: 0, disabledSpots: 0, evChargingSpots: 0 };
        leadData.needs_consultation = false;
      }

      const result = await submitQuote(leadData);

      if (result.success) {
        setIsSuccess(true);
      } else {
        alert("오류가 발생했습니다: " + result.error);
      }
    } catch (error) {
      alert("전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        {!isSuccess && (
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">신청 완료!</h3>
              <p className="text-gray-600">
                입력하신 번호로 예상 견적서를<br/>문자로 발송해 드렸습니다.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                담당자가 확인 후 {region} 지역 시공팀을<br/>빠르게 확인해 드리겠습니다.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
              >
                확인
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-2">
                  예상 견적서 무료 발송
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-snug">
                  상세 견적을<br/>문자로 보내드릴까요?
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  지금 연락처를 남기시면 <b>{region || "입력하신"}</b> 지역의<br/>
                  시공 가능 일정과 정확한 비용을 안내해 드립니다.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">시공 지역 (시/군/구)</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="예: 수원시 권선구, 용인시 처인구"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 placeholder:text-gray-400 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">연락처</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 placeholder:text-gray-400 font-medium"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "무료 문자 받기"
                  )}
                </button>
                <p className="text-[10px] text-center text-gray-400">
                  입력하신 정보는 견적 발송 외 용도로 사용되지 않습니다.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}