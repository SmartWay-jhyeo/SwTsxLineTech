"use server";

import { createClient } from "@/lib/supabase/server";

// 견적 요청 기본 타입
type BaseQuoteData = {
  service_type: "lane" | "epoxy";
  area: number;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  notes?: string;
};

// 차선 견적 타입
export type LaneQuoteInput = BaseQuoteData & {
  service_type: "lane";
  options: {
    workType: "new" | "repaint";
    locationType: "ground" | "underground";
    address: string;
    parkingData: {
      regularSpots: number;
      disabledSpots: number;
      evChargingSpots: number;
    };
  };
  base_cost: number;  // 구간 정액
  option_cost: number;  // 특수구역 추가금
  total_cost: number;
  needs_consultation: boolean;  // 200대 초과 시 true
};

// 에폭시 견적 타입
export type EpoxyQuoteInput = BaseQuoteData & {
  service_type: "epoxy";
  surface_condition: string;
  options: {
    material: string;
    finish?: string;
    color?: string;
    colorMixingFee: boolean;
    selfLeveling: boolean;
    floorCondition?: string;
    applicationMethod?: string;
    location?: string;
    // 신규 옵션
    floorQuality?: string;
    crackCondition?: string;
    antiSlip?: boolean;
    surfaceProtection?: boolean;
    photoUrls?: string[];
  };
  base_cost: number;
  option_cost: number;
  surcharge: number;
  total_cost: number;
  is_minimum_applied: boolean;
};

export type QuoteInput = LaneQuoteInput | EpoxyQuoteInput;

export type SubmitQuoteResult = {
  success: boolean;
  error?: string;
  id?: string;
};

/**
 * 견적 요청을 DB에 저장
 */
export async function submitQuote(data: QuoteInput): Promise<SubmitQuoteResult> {
  try {
    const supabase = await createClient();

    // DB 저장을 위한 데이터 변환
    const insertData = {
      service_type: data.service_type,
      area: data.area,
      surface_condition: data.service_type === "epoxy"
        ? (data as EpoxyQuoteInput).surface_condition
        : "normal",
      options: data.service_type === "lane"
        ? { ...data.options, needs_consultation: (data as LaneQuoteInput).needs_consultation }
        : data.options,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email || null,
      notes: data.notes || null,
      base_cost: data.base_cost,
      option_cost: data.option_cost,
      surcharge: data.service_type === "epoxy"
        ? (data as EpoxyQuoteInput).surcharge
        : 0,
      total_cost: data.total_cost,
      is_minimum_applied: data.service_type === "epoxy"
        ? (data as EpoxyQuoteInput).is_minimum_applied
        : false,
    };

    const { data: result, error } = await supabase
      .from("quotes")
      .insert(insertData)
      .select("id")
      .single();

    if (error) {
      console.error("견적 저장 에러:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: result.id };
  } catch (err) {
    console.error("견적 저장 중 예외 발생:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
    };
  }
}

/**
 * 관리자용: 견적 목록 조회
 */
export async function getQuotes() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("견적 조회 에러:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data };
  } catch (err) {
    console.error("견적 조회 중 예외 발생:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      data: []
    };
  }
}

export type QuoteStatus = "pending" | "confirmed" | "completed" | "cancelled";

/**
 * 견적 상태 변경
 */
export async function updateQuoteStatus(id: string, status: QuoteStatus) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("quotes")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("견적 상태 변경 에러:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("견적 상태 변경 중 예외 발생:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
    };
  }
}
