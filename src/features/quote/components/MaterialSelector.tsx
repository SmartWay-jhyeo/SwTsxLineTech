"use client";

import { cn } from "@/lib/utils";

type MaterialOption = {
  id: string;
  label: string;
  description?: string;
};

type MaterialSelectorProps = {
  title: string;
  options: MaterialOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function MaterialSelector({
  title,
  options,
  selectedId,
  onSelect,
}: MaterialSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-white text-sm font-medium">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-lg transition-all duration-200",
              "border text-sm",
              selectedId === option.id
                ? "bg-primary border-primary text-white"
                : "bg-transparent border-white/20 text-white/70 hover:border-white/40"
            )}
          >
            <span>{option.label}</span>
            {option.description && (
              <span className="block text-xs mt-1 opacity-70">
                {option.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
