"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryFilter } from "@/features/portfolio/components/CategoryFilter";
import { ProjectCard } from "@/features/portfolio/components/ProjectCard";

type Category = "all" | "lane" | "epoxy" | "paint";

// 임시 데이터
const mockProjects = [
  {
    id: "1",
    title: "아파트 지하주차장 차선도색",
    category: "lane" as const,
    location: "서울 강남구",
    date: "2024.11",
    area: 3500,
    imageUrl: "/images/bg-lane.jpg",
  },
  {
    id: "2",
    title: "물류창고 에폭시 바닥공사",
    category: "epoxy" as const,
    location: "경기 평택시",
    date: "2024.10",
    area: 5000,
    imageUrl: "/images/bg-epoxy.jpg",
  },
  {
    id: "3",
    title: "상가건물 외벽 도장공사",
    category: "paint" as const,
    location: "인천 남동구",
    date: "2024.09",
    area: 2200,
    imageUrl: "/images/bg-paint.jpg",
  },
  {
    id: "4",
    title: "공장 주차장 라인도색",
    category: "lane" as const,
    location: "경기 화성시",
    date: "2024.08",
    area: 1800,
    imageUrl: "/images/bg-lane.jpg",
  },
  {
    id: "5",
    title: "체육관 바닥 우레탄 방수",
    category: "epoxy" as const,
    location: "서울 송파구",
    date: "2024.07",
    area: 1200,
    imageUrl: "/images/bg-epoxy.jpg",
  },
  {
    id: "6",
    title: "아파트 계단실 도장",
    category: "paint" as const,
    location: "서울 마포구",
    date: "2024.06",
    area: 800,
    imageUrl: "/images/bg-paint.jpg",
  },
];

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const filteredProjects =
    selectedCategory === "all"
      ? mockProjects
      : mockProjects.filter((project) => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Back Button */}
      <div className="pt-6 px-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>돌아가기</span>
        </Link>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-4">시공 실적</h1>
        <p className="text-center text-muted-foreground mb-10">
          라인테크의 다양한 시공 실적을 확인해보세요
        </p>

        {/* Category Filter */}
        <div className="mb-10">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              category={project.category}
              location={project.location}
              date={project.date}
              area={project.area}
              imageUrl={project.imageUrl}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            해당 카테고리의 시공 실적이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
