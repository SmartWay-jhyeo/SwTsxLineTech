"use client";

import { Calculator, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceCalculationResult } from "../utils/parkingCalculator";
import type { PricingRule } from "@/features/quote/actions";

type EstimatedPriceProps = {
  priceResult: PriceCalculationResult | null;
  className?: string;
  pricingRules?: PricingRule[];
};

function formatToMan(value: number) {
  return `${Math.round(value / 10000).toLocaleString()}만원`;
}

export function EstimatedPrice({ priceResult, className, pricingRules }: EstimatedPriceProps) {
  if (!priceResult || (priceResult.total === 0 && !priceResult.needsConsultation)) return null;

  // 가격 추출
  const getPrice = (key: string, fallback: number) => {
    if (!pricingRules) return fallback;
    const rule = pricingRules.find(r => r.service_type === 'lane' && (r.category === 'tier' || r.category === 'option') && r.key === key);
    return rule ? Number(rule.value) : fallback;
  };

  const tier20 = getPrice('tier_20', 800000);
  const tier100 = getPrice('tier_100', 1250000);
  const tier200 = getPrice('tier_200', 2400000);
  const specialSpot = getPrice('special_spot', 250000);

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Calculator size={18} className="text-primary" />
        <h3 className="text-white text-sm font-medium">예상 견적</h3>
      </div>

      <div className="text-center py-2">
        <p className="text-primary text-3xl font-bold">{priceResult.formatted}</p>
        {priceResult.needsConsultation && (
          <div className="flex items-center justify-center gap-1 mt-2 text-yellow-400 text-xs">
            <AlertCircle size={14} />
            <span>200대 초과 - 별도 문의 바랍니다</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-white/40 text-xs text-center">
          * 1~20대 {formatToMan(tier20)} / 21~100대 {formatToMan(tier100)} / 101~200대 {formatToMan(tier200)}
          <br />
          * 장애인·전기차 구역 추가 시 면당 {formatToMan(specialSpot)} 추가
          <br />
          * 실제 견적은 현장 상황에 따라 달라질 수 있습니다
        </p>
      </div>
    </div>
  );
}
