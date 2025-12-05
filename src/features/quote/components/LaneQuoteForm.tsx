"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowRight, Sparkles, PaintBucket, Building2, Trees, Loader2 } from "lucide-react";
import { submitQuote, type LaneQuoteInput } from "../actions";
import { ParkingAreaMap } from "./ParkingAreaMap";
import { ParkingOptions } from "./ParkingOptions";
import { EstimatedPrice } from "./EstimatedPrice";
import { TourGuide } from "./TourGuide";
import { calculateParkingSpots, calculateEstimatedPrice, formatArea, LocationType } from "../utils/parkingCalculator";

type WorkType = "new" | "repaint";

type LaneQuoteFormProps = {
  className?: string;
};

export function LaneQuoteForm({ className }: LaneQuoteFormProps) {
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
      return calculateEstimatedPrice(manualParkingData);
    }
    return null;
  }, [workType, manualParkingData]);

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
      base_cost: estimatedPrice?.subtotal || 0,
      option_cost: 0,
      total_cost: estimatedPrice?.total || 0,
      is_minimum_applied: estimatedPrice?.isMinimumApplied || false,
    };

    setIsSubmitting(true);
    try {
      const result = await submitQuote(quoteData);

      if (result.success) {
        alert("견적 요청이 접수되었습니다!\n담당자가 빠른 시일 내에 연락드리겠습니다.");
        // 폼 초기화
        handleFullReset();
        setContactName("");
        setContactPhone("");
        setNotes("");
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

      {/* 옵션 선택 영역 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* 작업 유형 탭 */}
        <div className="flex flex-1 bg-white/5 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setWorkType("new")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all ${
              workType === "new"
                ? "bg-primary text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Sparkles size={18} />
            신규 도색
          </button>
          <button
            type="button"
            onClick={() => setWorkType("repaint")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all ${
              workType === "repaint"
                ? "bg-primary text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <PaintBucket size={18} />
            기존 덧칠
          </button>
        </div>

        {/* 주차장 위치 탭 */}
        <div className="flex flex-1 bg-white/5 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setLocationType("ground")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all ${
              locationType === "ground"
                ? "bg-primary text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Trees size={18} />
            지상
          </button>
          <button
            type="button"
            onClick={() => setLocationType("underground")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all ${
              locationType === "underground"
                ? "bg-primary text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Building2 size={18} />
            지하
          </button>
        </div>
      </div>

      {/* 단일 컬럼 레이아웃 */}
      <div className="space-y-6">
        {/* 지도 영역 (전체 가로 폭) */}
        <ParkingAreaMap
          onAreaChange={setArea}
          onAddressChange={setAddress}
          onReset={handleFullReset}
        />

        {/* 하단: 옵션 영역 */}
        <div className="space-y-6">
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
          {workType === "new" && estimatedPrice && estimatedPrice.total > 0 && (
            <EstimatedPrice priceResult={estimatedPrice} />
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
                className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
              />
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="연락처 (필수) *"
                className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
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
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="mt-8">
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
  );
}
