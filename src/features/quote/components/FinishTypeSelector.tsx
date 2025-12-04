"use client";

import { cn } from "@/lib/utils";

type FinishType = "glossy" | "matte" | "satin";

type FinishTypeSelectorProps = {
  selectedType: FinishType | null;
  onSelect: (type: FinishType) => void;
};

const finishTypes: { id: FinishType; label: string }[] = [
  { id: "glossy", label: "유광" },
  { id: "matte", label: "무광" },
  { id: "satin", label: "반광" },
];

export function FinishTypeSelector({
  selectedType,
  onSelect,
}: FinishTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-white text-sm font-medium">마감 타입</h3>
      <div className="flex gap-2">
        {finishTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onSelect(type.id)}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-lg transition-all duration-200",
              "border text-sm",
              selectedType === type.id
                ? "bg-primary border-primary text-white"
                : "bg-transparent border-white/20 text-white/70 hover:border-white/40"
            )}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
