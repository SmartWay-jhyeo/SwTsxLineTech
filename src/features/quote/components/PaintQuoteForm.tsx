"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Calculator, ChevronUp, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculatePaintPrice, formatPrice, type PaintType } from "../utils/paintPriceCalculator";
import type { PricingRule } from "../actions";

type PaintQuoteFormProps = {
  pricingRules?: PricingRule[];
};

const PAINT_TYPES: { id: PaintType; name: string; description: string }[] = [
  { id: "interior", name: "내부 도장", description: "실내 벽면, 천장 등" },
  { id: "exterior", name: "외부 도장", description: "건물 외벽, 옥상 난간 등" },
];

export function PaintQuoteForm({ pricingRules }: PaintQuoteFormProps) {
  const router = useRouter();

  // Form State
  const [paintType, setPaintType] = useState<PaintType>("interior");
  const [area, setArea] = useState<string>("");
  const [isWaterproof, setIsWaterproof] = useState(false);
  const [isFireproof, setIsFireproof] = useState(false);
  const [isPutty, setIsPutty] = useState(false);

  // Contact State
  const [contactData, setContactData] = useState({
    location: "",
    name: "",
    phone: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  // Image Source
  const currentImage = useMemo(() => {
    return paintType === "interior" 
      ? "/images/in_out_paint/inpaint.jpg"
      : "/images/in_out_paint/outpaint.jpg";
  }, [paintType]);

  // Calculate Price
  const priceBreakdown = useMemo(() => {
    const areaNum = parseFloat(area) || 0;
    if (areaNum <= 0) return null;

    return calculatePaintPrice({
      type: paintType,
      area: areaNum,
      isWaterproof,
      isFireproof,
      isPutty,
      pricingRules,
    });
  }, [paintType, area, isWaterproof, isFireproof, isPutty, pricingRules]);

  // Helper to get dynamic price for display
  const getDisplayPrice = (key: string, fallback: number) => {
    if (!pricingRules) return fallback;
    const rule = pricingRules.find(r => r.service_type === 'paint' && r.key === key);
    return rule ? Number(rule.value) : fallback;
  };

  const handleSubmit = async () => {
    if (!area || parseFloat(area) <= 0) {
      alert("면적을 입력해주세요.");
      return;
    }
    if (!contactData.phone) {
      alert("연락처를 입력해주세요.");
      return;
    }

    // TODO: Implement paint quote submission action if distinct from epoxy/lane,
    // or use a generic submitQuote with appropriate options.
    // For now, assuming we just want to show the calculation and maybe submit a generic request.
    // I'll use alert for now as the Paint submission logic might need backend updates to support 'paint' service_type strictly.
    // Actually, `submitQuote` supports generic options, but let's check `actions.ts`.
    // `QuoteInput` type union supports `Lane` and `Epoxy`. I should probably add `Paint` to `actions.ts` types properly.
    // But the user asked for "Show estimate in real-time", submission is secondary for this task.
    // I'll implement submission alert for now or console log.
    alert("준비 중인 기능입니다. 전화 문의 부탁드립니다.");
  };

  // Summary Panel
  const QuoteSummaryPanel = ({ className, isMobile = false }: { className?: string; isMobile?: boolean }) => {
    const areaNum = parseFloat(area) || 0;

    if (areaNum <= 0) {
      return (
        <div className={cn("bg-white/5 rounded-xl p-6 border border-white/10", className)}>
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={20} className="text-primary" />
            <h3 className="text-white font-medium">예상 견적</h3>
          </div>
          <p className="text-white/50 text-sm">면적을 입력하면 예상 견적이 표시됩니다</p>
        </div>
      );
    }

    if (!priceBreakdown) return null;

    return (
      <div className={cn("bg-white/5 rounded-xl p-6 border border-white/10", className)}>
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={20} className="text-primary" />
          <h3 className="text-white font-medium">예상 견적</h3>
        </div>

        {/* 면적 */}
        <div className="mb-4 pb-4 border-b border-white/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/70">시공 면적</span>
            <span className="text-white font-medium">{areaNum} m² ({Math.round(areaNum * 0.3025 * 10) / 10}평)</span>
          </div>
        </div>

        {/* 내역 */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white">{paintType === 'interior' ? '내부 도장' : '외부 도장'} 기본</span>
            </div>
            <div className="flex justify-between items-center text-xs text-white/50 mt-0.5">
              <span>{formatPrice(priceBreakdown.basePricePerM2)}/m² × {areaNum}</span>
              <span className="text-white">{formatPrice(priceBreakdown.basePrice)}</span>
            </div>
          </div>

          {priceBreakdown.waterproofPrice > 0 && (
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-400">+ 방수 페인트</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/50 mt-0.5">
                <span>{formatPrice(getDisplayPrice('waterproof', 10000))}/m²</span>
                <span className="text-blue-400">{formatPrice(priceBreakdown.waterproofPrice)}</span>
              </div>
            </div>
          )}

          {priceBreakdown.fireproofPrice > 0 && (
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-red-400">+ 내화 페인트</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/50 mt-0.5">
                <span>{formatPrice(getDisplayPrice('fireproof', 15000))}/m²</span>
                <span className="text-red-400">{formatPrice(priceBreakdown.fireproofPrice)}</span>
              </div>
            </div>
          )}

          {priceBreakdown.puttyPrice > 0 && (
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-yellow-400">+ 퍼티 작업</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/50 mt-0.5">
                <span>{formatPrice(getDisplayPrice('putty', 5000))}/m²</span>
                <span className="text-yellow-400">{formatPrice(priceBreakdown.puttyPrice)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-white/70">예상 견적</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">{formatPrice(priceBreakdown.total)}</span>
              <p className="text-xs text-white/40">부가세 별도</p>
            </div>
          </div>
        </div>

        {!isMobile && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full mt-6 flex items-center justify-center gap-2 h-12 bg-primary rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <span>견적 요청하기</span>}
            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
      <div className="space-y-8 pb-32 lg:pb-8">
        {/* 이미지 미리보기 */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
          <Image
            src={currentImage}
            alt={paintType === "interior" ? "내부 도장" : "외부 도장"}
            fill
            className="object-cover transition-opacity duration-300"
            priority
          />
          {/* 텍스트 오버레이 */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-white text-xl font-bold">
              {paintType === "interior" ? "내부 도장" : "외부 도장"}
            </h2>
            <p className="text-white/70 text-sm">
              {paintType === "interior" 
                ? "실내 공간을 쾌적하고 깔끔하게 마감합니다" 
                : "건물의 첫인상을 결정하는 외벽 도장입니다"}
            </p>
          </div>
        </div>

        {/* 면적 */}
        <section className="space-y-3">
          <h3 className="text-white text-sm font-medium flex items-center gap-2">
            시공 면적 <span className="text-xs text-primary bg-primary/20 px-2 py-0.5 rounded">필수</span>
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="면적 입력"
                className="flex-1 bg-white border border-white/20 rounded-lg px-4 py-3 text-gray-900 text-lg placeholder:text-gray-400 focus:outline-none focus:border-primary"
              />
              <span className="text-white/70">m²</span>
            </div>
          </div>
        </section>

        {/* 도장 타입 */}
        <section className="space-y-4">
          <h3 className="text-white text-sm font-medium">도장 유형</h3>
          <div className="grid grid-cols-2 gap-4">
            {PAINT_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setPaintType(type.id)}
                className={cn(
                  "flex flex-col items-start p-4 rounded-lg border-2 transition-all",
                  paintType === type.id
                    ? "bg-primary/10 border-primary"
                    : "bg-white/5 border-white/10 hover:border-white/30"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">{type.name}</span>
                  {paintType === type.id && <Check size={14} className="text-primary" />}
                </div>
                <p className="text-white/50 text-xs text-left">{type.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 옵션 */}
        <section className="space-y-3">
          <h3 className="text-white text-sm font-medium">추가 옵션</h3>
          <div className="space-y-3">
            <label className={cn(
              "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
              isWaterproof ? "bg-blue-500/10 border-blue-500" : "bg-white/5 border-white/10 hover:border-white/30"
            )}>
              <input type="checkbox" checked={isWaterproof} onChange={(e) => setIsWaterproof(e.target.checked)} className="hidden" />
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center", isWaterproof ? "bg-blue-500 border-blue-500" : "border-white/30")}>
                {isWaterproof && <Check size={12} className="text-white" />}
              </div>
              <div className="flex-1">
                <span className="text-white font-medium">방수 페인트</span>
                <p className="text-white/50 text-xs">습기 차단 및 방수 효과 (+{formatPrice(getDisplayPrice('waterproof', 10000))}/m²)</p>
              </div>
            </label>

            <label className={cn(
              "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
              isFireproof ? "bg-red-500/10 border-red-500" : "bg-white/5 border-white/10 hover:border-white/30"
            )}>
              <input type="checkbox" checked={isFireproof} onChange={(e) => setIsFireproof(e.target.checked)} className="hidden" />
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center", isFireproof ? "bg-red-500 border-red-500" : "border-white/30")}>
                {isFireproof && <Check size={12} className="text-white" />}
              </div>
              <div className="flex-1">
                <span className="text-white font-medium">내화 페인트</span>
                <p className="text-white/50 text-xs">화재 확산 방지 (+{formatPrice(getDisplayPrice('fireproof', 15000))}/m²)</p>
              </div>
            </label>

            <label className={cn(
              "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
              isPutty ? "bg-yellow-500/10 border-yellow-500" : "bg-white/5 border-white/10 hover:border-white/30"
            )}>
              <input type="checkbox" checked={isPutty} onChange={(e) => setIsPutty(e.target.checked)} className="hidden" />
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center", isPutty ? "bg-yellow-500 border-yellow-500" : "border-white/30")}>
                {isPutty && <Check size={12} className="text-white" />}
              </div>
              <div className="flex-1">
                <span className="text-white font-medium">퍼티 작업 (빠데)</span>
                <p className="text-white/50 text-xs">벽면 평탄화 작업 (+{formatPrice(getDisplayPrice('putty', 5000))}/m²)</p>
              </div>
            </label>
          </div>
        </section>

        {/* 연락처 (간소화) */}
        <section className="space-y-3">
          <h3 className="text-white text-sm font-medium">연락처 정보</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={contactData.location}
              onChange={(e) => setContactData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="시공 장소"
              className="w-full bg-white border border-white/20 rounded-lg px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              value={contactData.name}
              onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="이름"
              className="w-full bg-white border border-white/20 rounded-lg px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-primary"
            />
            <input
              type="tel"
              value={contactData.phone}
              onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="연락처 (필수)"
              className="w-full bg-white border border-white/20 rounded-lg px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-primary"
            />
          </div>
        </section>

        {/* 모바일 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="lg:hidden w-full flex items-center justify-center gap-2 h-14 bg-primary rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <span>견적 요청하기</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Desktop Sticky Panel */}
      <div className="hidden lg:block">
        <QuoteSummaryPanel className="sticky top-4" />
      </div>

      {/* Mobile Fixed Panel */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {isMobilePanelOpen && (
          <div className="bg-black/95 backdrop-blur-lg border-t border-white/10 p-4 max-h-[60vh] overflow-y-auto">
            <QuoteSummaryPanel isMobile />
          </div>
        )}
        <div className="bg-black/95 backdrop-blur-lg border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Calculator size={18} className="text-primary" />
              <span className="text-white/70 text-sm">예상 견적</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg">
                {priceBreakdown ? formatPrice(priceBreakdown.total) : "0원"}
              </span>
              <ChevronUp size={18} className={cn("text-white/50 transition-transform", isMobilePanelOpen && "rotate-180")} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
