"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorOption = {
  id: string;
  name: string;
  hex: string;
};

type ColorPickerProps = {
  colors: ColorOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function ColorPicker({ colors, selectedId, onSelect }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-white text-sm font-medium">색상</h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onSelect(color.id)}
            className={cn(
              "relative w-10 h-10 rounded-full transition-all duration-200",
              "ring-offset-background ring-offset-2",
              selectedId === color.id && "ring-2 ring-primary"
            )}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            {selectedId === color.id && (
              <Check
                size={16}
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  // 밝은 색상에는 어두운 체크, 어두운 색상에는 밝은 체크
                  color.hex.toLowerCase() === "#ffffff" ||
                    color.hex.toLowerCase() === "#ffff00" ||
                    color.hex.toLowerCase() === "#ffa500"
                    ? "text-black"
                    : "text-white"
                )}
              />
            )}
          </button>
        ))}
      </div>
      {selectedId && (
        <p className="text-xs text-muted-foreground">
          선택됨: {colors.find((c) => c.id === selectedId)?.name}
        </p>
      )}
    </div>
  );
}
