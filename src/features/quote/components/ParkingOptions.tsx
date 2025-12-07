"use client";

import { Minus, Plus, Calculator, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParkingCalculationResult } from "../utils/parkingCalculator";

export type ParkingOptionsData = {
  disabledSpots: number;
  evChargingSpots: number;
  regularSpots: number;
};

type ParkingOptionsProps = {
  mode: "auto" | "manual" | "editable";
  autoResult?: ParkingCalculationResult;
  manualData: ParkingOptionsData;
  onManualChange: (data: ParkingOptionsData) => void;
  className?: string;
};

type CounterProps = {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

function Counter({ label, description, value, onChange, min = 0, max = 999 }: CounterProps) {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
      <div>
        <span className="text-white text-sm">{label}</span>
        {description && (
          <p className="text-white/50 text-xs mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={decrease}
          disabled={value <= min}
          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus size={18} className="sm:w-4 sm:h-4" />
        </button>
        <span className="text-white text-lg font-medium w-10 sm:w-8 text-center">{value}</span>
        <button
          type="button"
          onClick={increase}
          disabled={value >= max}
          className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus size={18} className="sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}

// Editable Row for editable mode
type EditableRowProps = {
  label: string;
  value: number;
  autoValue?: number;
  onChange: (value: number) => void;
  required?: boolean;
  min?: number;
  max?: number;
};

function EditableRow({ label, value, autoValue, onChange, required, min = 0, max = 999 }: EditableRowProps) {
  const isModified = autoValue !== undefined && value !== autoValue;

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">{label}</span>
          {required && (
            <span className="text-xs text-primary bg-primary/20 px-1.5 py-0.5 rounded">필수</span>
          )}
          {isModified && (
            <span className="text-xs text-yellow-400 bg-yellow-400/20 px-1.5 py-0.5 rounded">수정됨</span>
          )}
        </div>
        {autoValue !== undefined && (
          <p className="text-white/40 text-xs mt-0.5">자동 계산: {autoValue}대</p>
        )}
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => value > min && onChange(value - 1)}
          disabled={value <= min}
          className="w-11 h-11 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus size={18} className="sm:w-3.5 sm:h-3.5" />
        </button>
        <span className="text-white text-lg font-bold w-10 sm:w-8 text-center">{value}</span>
        <button
          type="button"
          onClick={() => value < max && onChange(value + 1)}
          disabled={value >= max}
          className="w-11 h-11 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus size={18} className="sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
}

type AutoResultRowProps = {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
  required?: boolean;
};

function AutoResultRow({ label, value, suffix = "대", highlight, required }: AutoResultRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className="text-white/70 text-sm">{label}</span>
        {required && (
          <span className="text-xs text-primary bg-primary/20 px-1.5 py-0.5 rounded">필수</span>
        )}
      </div>
      <span className={`text-lg font-bold ${highlight ? "text-primary" : "text-white"}`}>
        {value}{suffix}
      </span>
    </div>
  );
}

export function ParkingOptions({ mode, autoResult, manualData, onManualChange, className }: ParkingOptionsProps) {
  // 총 주차대수 계산 (editable 모드에서 사용)
  const totalSpots = manualData.regularSpots + manualData.disabledSpots + manualData.evChargingSpots;

  if (mode === "auto" && autoResult) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2">
          <Calculator size={18} className="text-primary" />
          <h3 className="text-white text-sm font-medium">자동 계산 결과</h3>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <AutoResultRow
            label="예상 총 주차대수"
            value={autoResult.totalSpots}
            highlight
          />
          <div className="border-t border-white/10 my-2" />
          <AutoResultRow
            label="일반 주차칸"
            value={autoResult.regularSpots}
          />
          <AutoResultRow
            label="장애인 주차칸"
            value={autoResult.disabledSpots}
            required={autoResult.disabledSpots > 0}
          />
          <AutoResultRow
            label="전기차 충전칸"
            value={autoResult.evSpots}
            required={autoResult.evSpots > 0}
          />
        </div>

        <p className="text-white/40 text-xs">
          * 면적 기반 자동 계산은 대략적인 수치입니다
          <br />
          * 정확한 대수를 아시면 전화 상담 시 알려주세요
        </p>
      </div>
    );
  }

  // Editable mode - 자동 계산 결과를 수정 가능하게
  if (mode === "editable") {
    return (
      <div className={cn("space-y-3", className)} data-tour="parking-options">
        <div className="flex items-center gap-2">
          <Calculator size={18} className="text-primary" />
          <h3 className="text-white text-sm font-medium">주차 구획 (수정 가능)</h3>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          {/* 총 주차대수 표시 */}
          <div className="flex items-center justify-between py-2 mb-2">
            <span className="text-white/70 text-sm">예상 총 주차대수</span>
            <span className="text-primary text-xl font-bold">{totalSpots}대</span>
          </div>
          <div className="border-t border-white/10 mb-2" />

          {/* 수정 가능한 카운터들 */}
          <div className="space-y-1">
            <EditableRow
              label="일반 주차칸"
              value={manualData.regularSpots}
              autoValue={autoResult?.regularSpots}
              onChange={(value) => onManualChange({ ...manualData, regularSpots: value })}
            />
            <EditableRow
              label="장애인 주차칸"
              value={manualData.disabledSpots}
              autoValue={autoResult?.disabledSpots}
              onChange={(value) => onManualChange({ ...manualData, disabledSpots: value })}
              required={manualData.disabledSpots > 0 || (autoResult?.disabledSpots ?? 0) > 0}
            />
            <EditableRow
              label="전기차 충전칸"
              value={manualData.evChargingSpots}
              autoValue={autoResult?.evSpots}
              onChange={(value) => onManualChange({ ...manualData, evChargingSpots: value })}
              required={manualData.evChargingSpots > 0 || (autoResult?.evSpots ?? 0) > 0}
            />
          </div>
        </div>

        <p className="text-white/40 text-xs">
          * 면적 기반 자동 계산은 대략적인 수치입니다
          <br />
          * 정확한 대수를 아시면 직접 수정하시거나, 전화 상담 시 알려주세요
        </p>
      </div>
    );
  }

  // Manual mode
  return (
    <div className={cn("space-y-3", className)} data-tour="parking-options">
      <div className="flex items-center gap-2">
        <Edit3 size={18} className="text-white/70" />
        <h3 className="text-white text-sm font-medium">주차 구획 개수 입력</h3>
      </div>

      <div className="bg-white/5 rounded-lg px-4">
        <Counter
          label="장애인 주차칸"
          description="법정 필수 구획"
          value={manualData.disabledSpots}
          onChange={(value) => onManualChange({ ...manualData, disabledSpots: value })}
        />
        <Counter
          label="전기차 충전칸"
          description="충전소 구획"
          value={manualData.evChargingSpots}
          onChange={(value) => onManualChange({ ...manualData, evChargingSpots: value })}
        />
        <Counter
          label="일반 주차칸"
          description="선택 사항"
          value={manualData.regularSpots}
          onChange={(value) => onManualChange({ ...manualData, regularSpots: value })}
        />
      </div>
    </div>
  );
}
