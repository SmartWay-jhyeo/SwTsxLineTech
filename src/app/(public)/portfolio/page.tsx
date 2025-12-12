import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryFilter } from "@/features/portfolio/components/CategoryFilter";
import { ProjectCard } from "@/features/portfolio/components/ProjectCard";
import { createClient } from "@/lib/supabase/server";
import { ServiceType, PortfolioCategory } from "@/types";
import { Metadata } from "next";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

const SEO_DATA: Record<string, { title: string; desc: string; keywords: string[] }> = {
  all: {
    title: "시공 실적 및 비용 공개",
    desc: "2,400건 이상의 투명한 시공 견적 데이터. 차선도색, 에폭시, 페인트 시공 사례와 실제 비용을 확인하세요.",
    keywords: ["건물 관리", "주차장 보수", "바닥 공사 비용", "시공 견적 비교"],
  },
  lane: {
    title: "주차선/차선 도색 시공 사례",
    desc: "신축 빌라, 아파트, 상가 주차장 도색 전문. 3초 만에 확인하는 주차선 견적 비용.",
    keywords: ["주차선 도색 비용", "주차장 라인 그리기", "카스토퍼 설치", "장애인 주차구역 규격"],
  },
  epoxy: {
    title: "에폭시 바닥 시공 사례 & 가격",
    desc: "공장, 창고, 카페 바닥 에폭시 코팅/라이닝. 빈티지 콩자갈 바닥 시공 비용 공개.",
    keywords: ["공장 바닥 에폭시", "카페 바닥 인테리어", "에폭시 평당 가격", "투명 에폭시"],
  },
  paint: {
    title: "건물 내외벽 페인트 시공 사례",
    desc: "상가 원상복구, 노후 건물 외벽 방수 페인트. 친환경 페인트 시공 견적 문의.",
    keywords: ["외벽 방수 페인트", "상가 페인트 시공", "옥상 방수 견적", "페인트 칠하는 비용"],
  },
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;
  const selectedCategory = (category as PortfolioCategory) || "all";
  const seo = SEO_DATA[selectedCategory] || SEO_DATA.all;

  return {
    title: `${seo.title} | 시공얼마`,
    description: seo.desc,
    keywords: [...SEO_DATA.all.keywords, ...(seo.keywords || [])],
    openGraph: {
      title: `${seo.title} | 시공얼마`,
      description: seo.desc,
      type: "website",
    },
  };
}

export default async function Page({ searchParams }: Props) {
  // searchParams.category 가져오기 (없으면 'all')
  const { category } = await searchParams;
  const selectedCategory = (category as PortfolioCategory) || "all";
  const seo = SEO_DATA[selectedCategory] || SEO_DATA.all;

  // Supabase에서 데이터 가져오기
  const supabase = await createClient();
  
  let query = supabase
    .from("portfolio_items")
    .select("*")
    .order("date", { ascending: false });

  if (selectedCategory !== "all") {
    query = query.eq("category", selectedCategory);
  }

  const { data: projects, error } = await query;

  if (error) {
    console.error("Error fetching portfolio items:", error);
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

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
        <h1 className="text-3xl font-bold text-center mb-4">{seo.title}</h1>
        <p className="text-center text-muted-foreground mb-10">
          {seo.desc}
        </p>

        {/* Category Filter */}
        <div className="mb-10">
          <CategoryFilter />
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              category={project.category as ServiceType} // Type assertion to unified ServiceType
              location={project.location}
              date={project.date}
              area={project.area}
              imageUrl={project.image_url} // DB column name matches
            />
          ))}
        </div>

        {/* Empty State */}
        {projects?.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            해당 카테고리의 시공 실적이 없습니다.
          </div>
        )}

        {/* SEO Text Block (Invisible to average user, visible to bots/interested users) */}
        <div className="mt-20 pt-10 border-t border-white/10 text-xs text-muted-foreground/50 leading-relaxed">
          <h2 className="text-sm font-bold text-muted-foreground mb-2">시공얼마 시공 서비스 안내</h2>
          <p>
            시공얼마는 {selectedCategory === 'lane' ? '주차선 도색' : selectedCategory === 'epoxy' ? '에폭시 바닥 시공' : selectedCategory === 'paint' ? '건물 페인트 도장' : '건물 유지보수'} 전문 플랫폼입니다. 
            서울, 경기, 인천 전 지역 {selectedCategory === 'all' ? '무료 방문 견적' : '맞춤형 시공'}이 가능합니다. 
            특히 {seo.keywords.join(", ")} 등 다양한 현장 경험을 보유하고 있으며, 
            중간 마진을 최소화한 투명한 {selectedCategory === 'all' ? '견적 시스템' : '정찰제'}을 운영하고 있습니다.
            <br />
            대표 전화: 010-4806-9911 | 책임 시공 및 1년 A/S 보장
          </p>
        </div>
      </div>
    </div>
  );
}
