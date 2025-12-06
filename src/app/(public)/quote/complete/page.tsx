"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, FileText, Phone } from "lucide-react";
import Link from "next/link";

type QuoteCompleteData = {
  serviceType: "lane" | "epoxy";
  // Lane 전용
  workType?: string;
  locationType?: string;
  regularSpots?: number;
  disabledSpots?: number;
  evChargingSpots?: number;
  // Epoxy 전용
  material?: string;
  finish?: string;
  color?: string;
  area?: number;
  location?: string;
  // 공통
  estimatedPrice: string;
  contactName: string;
  contactPhone: string;
};

export default function QuoteCompletePage() {
  const router = useRouter();
  const [data, setData] = useState<QuoteCompleteData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("quoteCompleteData");
    if (stored) {
      setData(JSON.parse(stored));
      sessionStorage.removeItem("quoteCompleteData");
    } else {
      router.push("/");
    }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const workTypeLabel = data.workType === "new" ? "신규 도색" : "기존 덧칠";
  const locationLabel = data.locationType === "ground" ? "지상" : "지하";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 pt-24 pb-12">
        {/* 완료 메시지 */}
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-bold mb-2">
            견적 요청이 완료되었습니다!
          </h1>
          <p className="text-white/60">
            담당자가 빠른 시일 내에 연락드리겠습니다.
          </p>
        </div>

        {/* 선택 옵션 요약 */}
        <div className="bg-white/5 rounded-xl p-6 mb-6">
          <h2 className="text-white font-medium mb-4 flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            선택하신 옵션
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">서비스</span>
              <span className="text-white">
                {data.serviceType === "lane" ? "차선/주차장 도색" : "에폭시 바닥재"}
              </span>
            </div>

            {data.serviceType === "lane" ? (
              // Lane 정보
              <>
                <div className="flex justify-between">
                  <span className="text-white/60">작업 유형</span>
                  <span className="text-white">{workTypeLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">주차장 위치</span>
                  <span className="text-white">{locationLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">주차 대수</span>
                  <span className="text-white">
                    일반 {data.regularSpots}대
                    {data.disabledSpots && data.disabledSpots > 0 && `, 장애인 ${data.disabledSpots}대`}
                    {data.evChargingSpots && data.evChargingSpots > 0 && `, 전기차 ${data.evChargingSpots}대`}
                  </span>
                </div>
              </>
            ) : (
              // Epoxy 정보
              <>
                {data.material && (
                  <div className="flex justify-between">
                    <span className="text-white/60">마감재</span>
                    <span className="text-white">{data.material}</span>
                  </div>
                )}
                {data.finish && (
                  <div className="flex justify-between">
                    <span className="text-white/60">광택</span>
                    <span className="text-white">{data.finish}</span>
                  </div>
                )}
                {data.color && (
                  <div className="flex justify-between">
                    <span className="text-white/60">색상</span>
                    <span className="text-white">{data.color}</span>
                  </div>
                )}
                {data.area && (
                  <div className="flex justify-between">
                    <span className="text-white/60">시공 면적</span>
                    <span className="text-white">{data.area} m²</span>
                  </div>
                )}
                {data.location && (
                  <div className="flex justify-between">
                    <span className="text-white/60">시공 장소</span>
                    <span className="text-white">{data.location}</span>
                  </div>
                )}
              </>
            )}

            {/* 공통: 예상 견적 */}
            {data.estimatedPrice && data.estimatedPrice !== "0원" && (
              <div className="flex justify-between pt-3 border-t border-white/10">
                <span className="text-white/60">예상 견적</span>
                <span className="text-primary font-bold">{data.estimatedPrice}</span>
              </div>
            )}
          </div>
        </div>

        {/* 안심 문구 */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-8">
          <div className="flex gap-3">
            <Phone size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium mb-1">
                내용이 달라도 괜찮아요!
              </p>
              <p className="text-white/60 text-sm">
                선택하신 내용과 실제 현장이 다르더라도 걱정하지 마세요.
                전화 상담 시 변경 가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-white/10 rounded-full text-white font-medium hover:bg-white/20 transition-colors"
          >
            <Home size={18} />
            홈으로
          </Link>
          <Link
            href={data.serviceType === "lane" ? "/quote/lane" : "/quote/epoxy"}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary rounded-full text-white font-medium hover:opacity-90 transition-opacity"
          >
            <FileText size={18} />
            다른 견적 요청
          </Link>
        </div>
      </div>
    </div>
  );
}
