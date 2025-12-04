"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Category = "all" | "lane" | "epoxy" | "paint";

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "lane", label: "차선/주차선" },
  { id: "epoxy", label: "바닥 에폭시" },
  { id: "paint", label: "도장공사" },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = (searchParams.get("category") as Category) || "all";

  const handleCategoryChange = (category: Category) => {
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
