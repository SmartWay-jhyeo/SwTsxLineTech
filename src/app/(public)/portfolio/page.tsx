import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryFilter } from "@/features/portfolio/components/CategoryFilter";
import { ProjectCard } from "@/features/portfolio/components/ProjectCard";
import { createClient } from "@/lib/supabase/server";

type Category = "all" | "lane" | "epoxy" | "paint";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  // searchParams.category 가져오기 (없으면 'all')
  const { category } = await searchParams;
  const selectedCategory = (category as Category) || "all";

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
        <h1 className="text-3xl font-bold text-center mb-4">시공 실적</h1>
        <p className="text-center text-muted-foreground mb-10">
          라인테크의 다양한 시공 실적을 확인해보세요
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
              category={project.category as Category} // Type assertion
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
      </div>
    </div>
  );
}