/**
 * 에폭시 바닥 시공 가격 계산 유틸리티
 */

import {
  MATERIAL_PRICES,
  FLOOR_CONDITION_PRICES,
  SELF_LEVELING_PRICE,
  COLOR_MIXING_FEE,
  MIN_SERVICE_FEE,
  getBasePriceByArea,
  FLOOR_QUALITY,
  CRACK_CONDITION,
  ANTI_SLIP,
  SURFACE_PROTECTION,
  type MaterialId,
  type FloorConditionId,
  type FloorQualityId,
  type CrackConditionId,
} from "../data/floorMaterials";

// 견적 계산 입력 타입
export type EpoxyQuoteInput = {
  materialId: MaterialId;
  area: number;                       // m²
  floorCondition?: FloorConditionId;  // 칼라 에폭시용 (레거시)
  floorQuality?: FloorQualityId;      // 바닥 상태 (신규)
  crackCondition?: CrackConditionId;  // 균열 상태 (신규)
  includeAntiSlip: boolean;           // 미끄럼 방지 처리 (신규)
  includeSurfaceProtection: boolean;  // 표면 보호막 (신규)
  includeSelfLeveling: boolean;
  needsColorMixingFee: boolean;
};

// 가격 항목별 내역
export type PriceBreakdown = {
  basePricePerM2: number;         // m² 단가 (면적별 차등)
  basePrice: number;              // 기본 시공비 (단가 × 면적)
  floorQualityPrice: number;      // 바닥 상태 추가 비용 (신규)
  crackRepairPrice: number;       // 균열 보수 추가 비용 (신규)
  antiSlipPrice: number;          // 미끄럼 방지 처리 비용 (신규)
  surfaceProtectionPrice: number; // 표면 보호막 비용 (신규)
  selfLevelingPricePerM2: number;
  selfLevelingPrice: number;      // 셀프레벨링 추가
  colorMixingFee: number;         // 조색비
  subtotal: number;               // 소계
  isMinFeeApplied: boolean;       // 최소 출장비 적용 여부
  total: number;                  // 최종 금액
};

/**
 * 에폭시 견적 가격 계산 (신규 면적별 가격 체계)
 */
export function calculateEpoxyPrice(input: EpoxyQuoteInput): PriceBreakdown {
  const {
    materialId,
    area,
    floorCondition,
    floorQuality,
    crackCondition,
    includeAntiSlip,
    includeSurfaceProtection,
    includeSelfLeveling,
    needsColorMixingFee
  } = input;

  // 1. 기본 단가 결정 (면적별 차등 가격 적용)
  let basePricePerM2: number;
  if (materialId === "solid_epoxy" && floorCondition) {
    // 레거시: 칼라 에폭시는 바닥 상태에 따라 단가 결정
    basePricePerM2 = FLOOR_CONDITION_PRICES[floorCondition];
  } else {
    // 신규: 면적별 차등 가격 (500㎡+ → 35,000 ... 100㎡- → 65,000)
    basePricePerM2 = getBasePriceByArea(area);
  }

  // 2. 기본 시공비
  const basePrice = basePricePerM2 * area;

  // 3. 바닥 상태 추가 비용 (신규)
  const floorQualityPrice = floorQuality && FLOOR_QUALITY[floorQuality]
    ? FLOOR_QUALITY[floorQuality].price * area
    : 0;

  // 4. 균열 보수 추가 비용 (신규)
  const crackRepairPrice = crackCondition && CRACK_CONDITION[crackCondition]
    ? CRACK_CONDITION[crackCondition].price * area
    : 0;

  // 5. 미끄럼 방지 처리 (신규)
  const antiSlipPrice = includeAntiSlip ? ANTI_SLIP.price * area : 0;

  // 6. 표면 보호막 (신규)
  const surfaceProtectionPrice = includeSurfaceProtection ? SURFACE_PROTECTION.price * area : 0;

  // 7. 셀프레벨링
  const selfLevelingPricePerM2 = includeSelfLeveling ? SELF_LEVELING_PRICE : 0;
  const selfLevelingPrice = selfLevelingPricePerM2 * area;

  // 8. 조색비 (고정 금액)
  const colorMixingFee = needsColorMixingFee ? COLOR_MIXING_FEE : 0;

  // 9. 소계
  const subtotal =
    basePrice +
    floorQualityPrice +
    crackRepairPrice +
    antiSlipPrice +
    surfaceProtectionPrice +
    selfLevelingPrice +
    colorMixingFee;

  // 10. 최소 출장비 적용
  const isMinFeeApplied = subtotal < MIN_SERVICE_FEE && subtotal > 0;
  const total = subtotal > 0 ? Math.max(subtotal, MIN_SERVICE_FEE) : 0;

  return {
    basePricePerM2,
    basePrice,
    floorQualityPrice,
    crackRepairPrice,
    antiSlipPrice,
    surfaceProtectionPrice,
    selfLevelingPricePerM2,
    selfLevelingPrice,
    colorMixingFee,
    subtotal,
    isMinFeeApplied,
    total,
  };
}

/**
 * 금액을 한글 형식으로 포맷 (예: 1,350,000원)
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

/**
 * 면적을 평으로 변환 (1평 ≈ 3.3058m²)
 */
export function sqmToPyeong(sqm: number): number {
  return Math.round(sqm / 3.3058 * 10) / 10;
}

/**
 * 평을 면적으로 변환
 */
export function pyeongToSqm(pyeong: number): number {
  return Math.round(pyeong * 3.3058 * 10) / 10;
}
