"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calculator, ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateEpoxyPrice, formatPrice } from "@/features/quote/utils/epoxyPriceCalculator";
import { calculatePaintPrice } from "@/features/quote/utils/paintPriceCalculator";
import { calculateEstimatedPrice, calculateParkingSpots } from "@/features/quote/utils/parkingCalculator";
import { FLOOR_MATERIALS } from "@/features/quote/data/floorMaterials";
import { SimpleLeadModal } from "./SimpleLeadModal";
import type { PricingRule } from "@/features/quote/actions";

type ServiceTab = "epoxy" | "lane" | "paint";

export function QuickQuoteCalculator({ pricingRules }: { pricingRules: PricingRule[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ServiceTab>("epoxy");
  const [area, setArea] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<{ min: number; max: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Epoxy State
  const [epoxyMaterial, setEpoxyMaterial] = useState("solid_epoxy");

  // Lane State
  const [laneType, setLaneType] = useState<"new" | "repaint">("new");
  
  // Paint State
  const [paintType, setPaintType] = useState<"interior" | "exterior">("interior");

  // 실시간 계산
  useEffect(() => {
    const areaNum = parseFloat(area);
    if (!areaNum || areaNum <= 0) {
      setCalculatedPrice(null);
      return;
    }

    let price = 0;
    let minPrice = 0;
    let maxPrice = 0;

    try {
      if (activeTab === "epoxy") {
        const result = calculateEpoxyPrice({
          materialId: epoxyMaterial as any,
          area: areaNum,
          floorQuality: "normal",
          crackCondition: "moderate",
          includeSelfLeveling: false,
          includeAntiSlip: false,
          includeSurfaceProtection: false,
          needsColorMixingFee: false,
          pricingRules, // Pass pricing rules
        });
        price = result.total;
        // 오차 범위 +/- 10%
        minPrice = Math.floor(price * 0.9 / 10000) * 10000;
        maxPrice = Math.ceil(price * 1.1 / 10000) * 10000;
      } else if (activeTab === "lane") {
        // 면적으로 주차대수 추산
        const autoSpots = calculateParkingSpots(areaNum, "ground");
        const result = calculateEstimatedPrice({
          regularSpots: autoSpots.regularSpots,
          disabledSpots: autoSpots.disabledSpots,
          evChargingSpots: autoSpots.evSpots,
          pricingRules, // Pass pricing rules
        });
        price = result.total;
         // 차선은 변수가 많으므로 범위 넓게
        minPrice = Math.floor(price * 0.9 / 10000) * 10000;
        maxPrice = Math.ceil(price * 1.15 / 10000) * 10000;
      } else if (activeTab === "paint") {
        const result = calculatePaintPrice({
          type: paintType,
          area: areaNum,
          isWaterproof: false,
          isFireproof: false,
          isPutty: false,
          pricingRules, // Pass pricing rules
        });
        price = result.total;
        minPrice = Math.floor(price * 0.9 / 10000) * 10000;
        maxPrice = Math.ceil(price * 1.1 / 10000) * 10000;
      }

      setCalculatedPrice({ min: minPrice, max: maxPrice });
    } catch (e) {
      console.error("Calculation error", e);
      setCalculatedPrice(null);
    }
  }, [activeTab, area, epoxyMaterial, laneType, paintType, pricingRules]);

  const handleDetailedQuote = () => {
    router.push(`/quote/${activeTab}`);
  };

  const handleSimpleQuote = () => {
    if (!calculatedPrice) {
        // 면적이 입력되지 않았으면 입력 필드 포커스 유도 (여기선 간단히 얼럿)
        alert("면적을 입력해주세요.");
        return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-black/40 p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="text-white font-bold text-lg">3초 간편 견적</h3>
          </div>
          <p className="text-white/60 text-xs">평수만 입력하면 예상 시공비가 즉시 산출됩니다.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("epoxy")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors relative",
              activeTab === "epoxy" ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            바닥 에폭시
            {activeTab === "epoxy" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
                  <button
                    onClick={() => setActiveTab("lane")}
                    className={cn(
                      "flex-1 py-3 text-sm font-medium transition-colors relative",
                      activeTab === "lane" ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    주차장 도색
                    {activeTab === "lane" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                  </button>          <button
            onClick={() => setActiveTab("paint")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors relative",
              activeTab === "paint" ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            페인트 도장
            {activeTab === "paint" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* Common: Area Input */}
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">면적 (평수/m²)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="예: 50"
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
                />
                <div className="flex items-center px-3 bg-white/5 border border-white/20 rounded-lg">
                  <span className="text-white/60 text-sm">m²</span>
                </div>
              </div>
              {area && (
                <p className="text-white/40 text-xs text-right">
                  ≈ {Math.round(parseFloat(area) * 0.3025)}평
                </p>
              )}
            </div>

            {/* Specific Options based on Tab */}
            {activeTab === "epoxy" && (
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">시공 종류</label>
                <select
                  value={epoxyMaterial}
                  onChange={(e) => setEpoxyMaterial(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary [&>option]:bg-gray-900"
                >
                  {FLOOR_MATERIALS.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === "lane" && (
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">작업 유형</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLaneType("new")}
                    className={cn(
                      "py-2.5 rounded-lg text-sm border transition-all",
                      laneType === "new"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    )}
                  >
                    신규 도색
                  </button>
                  <button
                    onClick={() => setLaneType("repaint")}
                    className={cn(
                      "py-2.5 rounded-lg text-sm border transition-all",
                      laneType === "repaint"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    )}
                  >
                    기존 덧칠
                  </button>
                </div>
              </div>
            )}

            {activeTab === "paint" && (
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">작업 위치</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaintType("interior")}
                    className={cn(
                      "py-2.5 rounded-lg text-sm border transition-all",
                      paintType === "interior"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    )}
                  >
                    실내 도장
                  </button>
                  <button
                    onClick={() => setPaintType("exterior")}
                    className={cn(
                      "py-2.5 rounded-lg text-sm border transition-all",
                      paintType === "exterior"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    )}
                  >
                    외부/방수
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Price Display */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-5 border border-primary/20">
            <div className="flex justify-between items-start mb-1">
              <span className="text-white/70 text-sm">예상 견적가</span>
              {calculatedPrice && (
                <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded font-bold">
                  VAT 별도
                </span>
              )}
            </div>
            
            {calculatedPrice ? (
              <div className="flex items-baseline gap-1 mt-1 animate-in fade-in slide-in-from-bottom-2">
                <span className="text-3xl font-bold text-white">
                  {formatPrice(calculatedPrice.min)}
                </span>
                <span className="text-white/50 text-lg">~</span>
                <span className="text-2xl font-semibold text-white/80">
                  {formatPrice(calculatedPrice.max)}
                </span>
              </div>
            ) : (
              <div className="h-[36px] flex items-center text-white/30 text-lg">
                면적을 입력해주세요
              </div>
            )}
          </div>

          {/* Buttons (Two-Track Strategy) */}
          <div className="space-y-3">
            {/* Primary: Simple Lead (Text Message) */}
            <button
              onClick={handleSimpleQuote}
              className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/25"
            >
              <MessageCircle className="w-5 h-5" />
              <span>예상 견적 문자로 받기</span>
            </button>

            {/* Secondary: Detailed Quote */}
            <button
              onClick={handleDetailedQuote}
              className="w-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all border border-white/10"
            >
              <span>직접 옵션 선택하고 상세 견적 내기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-white/40 text-[10px]">
            * 위 견적은 예상 금액이며, 현장 상황에 따라 달라질 수 있습니다.
          </p>
        </div>
      </div>

      {/* Simple Lead Modal */}
      <SimpleLeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceType={activeTab}
        area={parseFloat(area) || 0}
        priceRange={calculatedPrice || { min: 0, max: 0 }}
      />
    </>
  );
}
