"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { PortfolioCategory } from "@/types";

const categories: { id: PortfolioCategory; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "epoxy", label: "바닥 에폭시" },
  { id: "lane", label: "주차장 도색" },
  { id: "paint", label: "페인트 도장" },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = (searchParams.get("category") as PortfolioCategory) || "all";

  const handleCategoryChange = (category: PortfolioCategory) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => handleCategoryChange(category.id)}
          className={cn(
            "px-6 py-2.5 rounded-full text-sm transition-all duration-200",
            selectedCategory === category.id
              ? "bg-primary text-white"
              : "bg-transparent text-white border border-white/30 hover:border-white/60"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
