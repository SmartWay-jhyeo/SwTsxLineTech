"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// 시공 사례 삭제
export async function deletePortfolioItem(id: string, imageUrl: string) {
  const supabase = await createClient();

  // 1. 스토리지에서 이미지 삭제
  // 이미지 URL에서 파일 경로 추출 (예: .../portfolio/abc.jpg -> abc.jpg)
  const imagePath = imageUrl.split("/").pop();
  if (imagePath) {
    await supabase.storage.from("portfolio").remove([imagePath]);
  }

  // 2. DB에서 데이터 삭제
  const { error } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "삭제 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin");
  revalidatePath("/portfolio");
}
