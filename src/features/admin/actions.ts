"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// 시공 사례 등록
export async function createPortfolioItem(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const location = formData.get("location") as string;
  const date = formData.get("date") as string;
  const area = formData.get("area") as string;
  const imageFile = formData.get("image") as File;

  if (!title || !category || !location || !date || !area || !imageFile) {
    return { error: "모든 필드를 입력해주세요." };
  }

  // 1. 이미지 업로드 (Supabase Storage)
  const fileExt = imageFile.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from("portfolio")
    .upload(fileName, imageFile);

  if (uploadError) {
    console.error("Upload Error:", uploadError);
    return { error: "이미지 업로드에 실패했습니다." };
  }

  // 이미지 URL 생성
  const { data: { publicUrl } } = supabase.storage
    .from("portfolio")
    .getPublicUrl(fileName);

  // 2. DB 저장
  const { error: dbError } = await supabase.from("portfolio_items").insert({
    title,
    category,
    location,
    date,
    area: Number(area),
    image_url: publicUrl,
  });

  if (dbError) {
    console.error("DB Error:", dbError);
    return { error: "데이터베이스 저장에 실패했습니다." };
  }

  revalidatePath("/admin");
  revalidatePath("/portfolio");
  redirect("/admin");
}

// 시공 사례 삭제
export async function deletePortfolioItem(id: string, imageUrl: string) {
  const supabase = await createClient();

  // 1. 스토리지에서 이미지 삭제
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