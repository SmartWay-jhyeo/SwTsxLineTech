"use client";

import { Calculator, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceCalculationResult, PRICE_INFO } from "../utils/parkingCalculator";

type EstimatedPriceProps = {
  priceResult: PriceCalculationResult | null;
  className?: string;
};

export function EstimatedPrice({ priceResult, className }: EstimatedPriceProps) {
  if (!priceResult || priceResult.total === 0) return null;

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
        {priceResult.isMinimumApplied && (
          <div className="flex items-center justify-center gap-1 mt-2 text-yellow-400 text-xs">
            <AlertCircle size={14} />
            <span>최소 출장비 적용 ({(PRICE_INFO.minMobilization / 10000).toLocaleString()}만원)</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-white/40 text-xs text-center">
          * 일반 {(PRICE_INFO.regular / 10000).toLocaleString()}만원 / 장애인·전기차 {(PRICE_INFO.disabled / 10000).toLocaleString()}만원 기준
          <br />
          * 실제 견적은 현장 상황에 따라 달라질 수 있습니다
        </p>
      </div>
    </div>
  );
}
