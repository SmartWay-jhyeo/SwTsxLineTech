"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Trees, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitQuote, type LaneQuoteInput, type PricingRule } from "../actions";
import { ParkingAreaMap, type ParkingAreaMapRef } from "./ParkingAreaMap";
import { ParkingOptions } from "./ParkingOptions";
import { EstimatedPrice } from "./EstimatedPrice";
import { TourGuide } from "./TourGuide";
import { calculateParkingSpots, calculateEstimatedPrice, formatArea, LocationType } from "../utils/parkingCalculator";

type WorkType = "new" | "repaint";

type LaneQuoteFormProps = {
  className?: string;
  pricingRules?: PricingRule[];
};

export function LaneQuoteForm({ className, pricingRules }: LaneQuoteFormProps) {
  const router = useRouter();
  const mapRef = useRef<ParkingAreaMapRef>(null);

  // 작업 유형 (신규/덧칠)
  const [workType, setWorkType] = useState<WorkType>("new");

  // 주차장 위치 (지상/지하)
  const [locationType, setLocationType] = useState<LocationType>("ground");

  // 주소 및 면적
  const [address, setAddress] = useState("");
  const [area, setArea] = useState(0);

  // 수동 입력 데이터
  const [manualParkingData, setManualParkingData] = useState({
    disabledSpots: 0,
    evChargingSpots: 0,
    regularSpots: 0,
  });

  // 연락처
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 단계별 진행 상태
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);

  // 자동 계산 결과 (지상/지하에 따라 면적 계수 적용)
  const autoCalculation = useMemo(() => {
    if (area > 0) {
      return calculateParkingSpots(area, locationType);
    }
    return null;
  }, [area, locationType]);

  // 자동 계산 결과가 변경되면 수정 가능한 데이터에 동기화 (신규 도색일 때만)
  useEffect(() => {
    if (workType === "new" && autoCalculation) {
      setManualParkingData({
        regularSpots: autoCalculation.regularSpots,
        disabledSpots: autoCalculation.disabledSpots,
        evChargingSpots: autoCalculation.evSpots,
      });
    }
  }, [workType, autoCalculation]);

  // 예상 견적 계산 (신규 도색일 때만)
  const estimatedPrice = useMemo(() => {
    if (workType === "new") {
      return calculateEstimatedPrice({ ...manualParkingData, pricingRules });
    }
    return null;
  }, [workType, manualParkingData, pricingRules]);

  // 전체 초기화 (지도 초기화 버튼과 연동)
  const handleFullReset = () => {
    setArea(0);
    setAddress("");
    setManualParkingData({ disabledSpots: 0, evChargingSpots: 0, regularSpots: 0 });
    // workType과 locationType은 유지
  };

  const handleSubmit = async () => {
    if (!address) {
      alert("주소를 입력해주세요.");
      mapRef.current?.focusInput();
      return;
    }
    if (!contactPhone) {
      alert("연락처를 입력해주세요.");
      return;
    }

    const parkingData = workType === "new" && autoCalculation
      ? {
          regularSpots: autoCalculation.regularSpots,
          disabledSpots: autoCalculation.disabledSpots,
          evChargingSpots: autoCalculation.evSpots,
        }
      : manualParkingData;

    // 선택한 옵션들을 요약 텍스트로 생성
    const optionsSummary = [
      `[작업유형] ${workType === "new" ? "신규 도색" : "기존 덧칠"}`,
      `[주차장위치] ${locationType === "ground" ? "지상" : "지하"}`,
      address ? `[주소] ${address}` : null,
      `[주차구획] 일반 ${parkingData.regularSpots}대, 장애인 ${parkingData.disabledSpots}대, 전기차 ${parkingData.evChargingSpots}대`,
    ].filter(Boolean).join("\n");

    const fullNotes = notes
      ? `${optionsSummary}\n\n[추가요청]\n${notes}`
      : optionsSummary;

    // 서버 액션에 맞는 데이터 형식으로 변환
    const quoteData: LaneQuoteInput = {
      service_type: "lane",
      area,
      contact_name: contactName,
      contact_phone: contactPhone,
      notes: fullNotes,
      options: {
        workType,
        locationType,
        address,
        parkingData,
      },
      base_cost: estimatedPrice?.basePrice || 0,
      option_cost: estimatedPrice?.specialPrice || 0,
      total_cost: estimatedPrice?.total || 0,
      needs_consultation: estimatedPrice?.needsConsultation || false,
    };

    setIsSubmitting(true);
    try {
      const result = await submitQuote(quoteData);

      if (result.success) {
        // 완료 페이지에 전달할 데이터 저장
        const completeData = {
          serviceType: "lane",
          workType,
          locationType,
          regularSpots: parkingData.regularSpots,
          disabledSpots: parkingData.disabledSpots,
          evChargingSpots: parkingData.evChargingSpots,
          estimatedPrice: estimatedPrice?.formatted || "",
          contactName,
          contactPhone,
        };
        sessionStorage.setItem("quoteCompleteData", JSON.stringify(completeData));
        router.push("/quote/complete");
      } else {
        alert("견적 요청 중 오류가 발생했습니다.\n" + (result.error || "다시 시도해주세요."));
      }
    } catch {
      alert("견적 요청 중 오류가 발생했습니다.\n다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      {/* 투어 가이드 (첫 방문 시) */}
      <TourGuide />

      {/* STEP 1: 작업 유형 선택 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className={cn(
            "w-7 h-7 rounded-full text-sm flex items-center justify-center font-bold transition-all",
            step1Completed ? "bg-primary text-white" : "bg-white/20 text-white"
          )}>
            {step1Completed ? <Check size={16} /> : "1"}
          </span>
          <h3 className="text-white font-medium">작업 유형을 선택하세요</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { setWorkType("new"); setStep1Completed(true); }}
            className={cn(
              "flex flex-col items-center p-5 rounded-xl border-2 transition-all",
              workType === "new" && step1Completed
                ? "bg-primary/20 border-primary"
                : "bg-white/5 border-white/10 hover:border-white/30"
            )}
          >
            <span className="text-white font-medium">신규 도색</span>
            <span className="text-white/50 text-xs mt-1">새로 라인을 칠합니다</span>
          </button>
          <button
            type="button"
            onClick={() => { setWorkType("repaint"); setStep1Completed(true); }}
            className={cn(
              "flex flex-col items-center p-5 rounded-xl border-2 transition-all",
              workType === "repaint" && step1Completed
                ? "bg-primary/20 border-primary"
                : "bg-white/5 border-white/10 hover:border-white/30"
            )}
          >
            <span className="text-white font-medium">기존 덧칠</span>
            <span className="text-white/50 text-xs mt-1">기존 라인 위에 덧칠합니다</span>
          </button>
        </div>
      </div>

      {/* STEP 2: 주차장 위치 선택 (Step 1 완료 후 표시) */}
      {step1Completed && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <span className={cn(
              "w-7 h-7 rounded-full text-sm flex items-center justify-center font-bold transition-all",
              step2Completed ? "bg-primary text-white" : "bg-white/20 text-white"
            )}>
              {step2Completed ? <Check size={16} /> : "2"}
            </span>
            <h3 className="text-white font-medium">주차장 위치를 선택하세요</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setLocationType("ground"); setStep2Completed(true); }}
              className={cn(
                "flex flex-col items-center p-5 rounded-xl border-2 transition-all",
                locationType === "ground" && step2Completed
                  ? "bg-primary/20 border-primary"
                  : "bg-white/5 border-white/10 hover:border-white/30"
              )}
            >
              <Trees size={28} className={cn(
                "mb-2",
                locationType === "ground" && step2Completed ? "text-primary" : "text-white/70"
              )} />
              <span className="text-white font-medium">지상</span>
              <span className="text-white/50 text-xs mt-1">옥외 주차장</span>
            </button>
            <button
              type="button"
              onClick={() => { setLocationType("underground"); setStep2Completed(true); }}
              className={cn(
                "flex flex-col items-center p-5 rounded-xl border-2 transition-all",
                locationType === "underground" && step2Completed
                  ? "bg-primary/20 border-primary"
                  : "bg-white/5 border-white/10 hover:border-white/30"
              )}
            >
              <Building2 size={28} className={cn(
                "mb-2",
                locationType === "underground" && step2Completed ? "text-primary" : "text-white/70"
              )} />
              <span className="text-white font-medium">지하</span>
              <span className="text-white/50 text-xs mt-1">지하 주차장</span>
            </button>
          </div>
        </div>
      )}

      {/* 지도 및 나머지 폼 (Step 2 완료 후 표시) */}
      {step2Completed && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* 지도 영역 */}
          <ParkingAreaMap
            ref={mapRef}
            onAreaChange={setArea}
            onAddressChange={setAddress}
            onReset={handleFullReset}
          />

          {/* 측정 면적 표시 */}
          {area > 0 && (
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">측정 면적</span>
                <span className="text-primary text-2xl font-bold">
                  {formatArea(area)} m²
                </span>
              </div>
            </div>
          )}

          {/* 주차 구획 */}
          {workType === "new" ? (
            // 신규: 자동 계산 결과 (수정 가능)
            autoCalculation && autoCalculation.totalSpots > 0 ? (
              <ParkingOptions
                mode="editable"
                autoResult={autoCalculation}
                manualData={manualParkingData}
                onManualChange={setManualParkingData}
              />
            ) : (
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <p className="text-white/50 text-sm">
                  지도에서 영역을 측정하면<br />
                  주차 구획이 자동 계산됩니다
                </p>
              </div>
            )
          ) : (
            // 덧칠: 수동 입력
            <ParkingOptions
              mode="manual"
              manualData={manualParkingData}
              onManualChange={setManualParkingData}
            />
          )}

          {/* 예상 견적 (신규 도색일 때만) */}
          {workType === "new" && estimatedPrice && (estimatedPrice.total > 0 || estimatedPrice.needsConsultation) && (
            <EstimatedPrice priceResult={estimatedPrice} pricingRules={pricingRules} />
          )}

          {/* 연락처 정보 */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-medium">연락처 정보</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="담당자 이름"
                className="w-full bg-white border border-white/20 rounded-lg px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-primary"
              />
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="연락처 (필수) *"
                className="w-full bg-white border border-white/20 rounded-lg px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* 기타 요청사항 */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-medium">기타 요청사항</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="추가 요청사항이 있으시면 입력해주세요"
              rows={3}
              className="w-full bg-white border border-white/20 rounded-lg px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="mt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 h-14 bg-primary rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>요청 중...</span>
                </>
              ) : (
                <>
                  <span>견적 요청하기</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
