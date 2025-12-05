import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, FileText } from "lucide-react";
import { deletePortfolioItem } from "@/features/admin/actions";

// 포트폴리오 아이템 타입 정의
type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  image_url: string;
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">대시보드</h2>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/quotes" className="gap-2">
              <FileText size={16} />
              견적 관리
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/portfolio/new" className="gap-2">
              <Plus size={16} />
              새 사례 등록
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-6 py-3 font-medium">이미지</th>
              <th className="px-6 py-3 font-medium">제목</th>
              <th className="px-6 py-3 font-medium">카테고리</th>
              <th className="px-6 py-3 font-medium">시공일</th>
              <th className="px-6 py-3 font-medium text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  등록된 시공 사례가 없습니다.
                </td>
              </tr>
            ) : (
              items?.map((item: PortfolioItem) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {item.category === "lane" && "차선/주차선"}
                    {item.category === "epoxy" && "에폭시/방수"}
                    {item.category === "paint" && "도장"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <form
                      action={async () => {
                        "use server";
                        await deletePortfolioItem(item.id, item.image_url);
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
