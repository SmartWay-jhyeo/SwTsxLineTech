"use client";

import { Calculator, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceCalculationResult } from "../utils/parkingCalculator";

type EstimatedPriceProps = {
  priceResult: PriceCalculationResult | null;
  className?: string;
};

export function EstimatedPrice({ priceResult, className }: EstimatedPriceProps) {
  if (!priceResult || (priceResult.total === 0 && !priceResult.needsConsultation)) return null;

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
          * 1~20대 80만원 / 21~100대 125만원 / 101~200대 240만원
          <br />
          * 장애인·전기차 구역 추가 시 면당 25만원 추가
          <br />
          * 실제 견적은 현장 상황에 따라 달라질 수 있습니다
        </p>
      </div>
    </div>
  );
}
