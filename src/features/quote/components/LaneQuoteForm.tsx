"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowRight, Sparkles, PaintBucket } from "lucide-react";
import { ParkingAreaMap } from "./ParkingAreaMap";
import { ParkingOptions } from "./ParkingOptions";
import { EstimatedPrice } from "./EstimatedPrice";
import { TourGuide } from "./TourGuide";
import { calculateParkingSpots, calculateEstimatedPrice, formatArea } from "../utils/parkingCalculator";

type WorkType = "new" | "repaint";

type LaneQuoteFormProps = {
  className?: string;
};

export function LaneQuoteForm({ className }: LaneQuoteFormProps) {
  // 작업 유형 (신규/덧칠)
  const [workType, setWorkType] = useState<WorkType>("new");

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

  // 자동 계산 결과
  const autoCalculation = useMemo(() => {
    if (area > 0) {
      return calculateParkingSpots(area);
    }
    return null;
  }, [area]);

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

  const handleSubmit = () => {
    if (!address) {
      alert("주소를 입력해주세요.");
      return;
    }
    if (!contactPhone) {
      alert("연락처를 입력해주세요.");
      return;
    }

    const quoteData = {
      serviceType: "lane",
      workType,
      address,
      area,
      parkingData: workType === "new" ? autoCalculation : manualParkingData,
      contactName,
      contactPhone,
      notes,
    };

    console.log("견적 요청 데이터:", quoteData);
    alert("견적 요청이 접수되었습니다!\n담당자가 빠른 시일 내에 연락드리겠습니다.");
  };

  return (
    <div className={className}>
      {/* 투어 가이드 (첫 방문 시) */}
      <TourGuide />

      {/* 작업 유형 탭 */}
      <div className="flex mb-6 bg-white/5 rounded-lg p-1">
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

      {/* 2단 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 좌측: 지도 */}
        <div>
          <ParkingAreaMap
            onAreaChange={setArea}
            onAddressChange={setAddress}
          />
        </div>

        {/* 우측: 옵션 */}
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
          className="w-full flex items-center justify-center gap-2 h-14 bg-primary rounded-full text-white font-medium hover:opacity-90 transition-opacity"
        >
          <span>견적 요청하기</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
