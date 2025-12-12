/**
 * 에폭시 바닥 시공 가격 계산 유틸리티
 */

import {
  MATERIAL_PRICES,
  FLOOR_CONDITION_PRICES,
  SELF_LEVELING_PRICE,
  COLOR_MIXING_FEE,
  MIN_SERVICE_FEE,
  getBasePriceByArea as getBasePriceByAreaDefault,
  FLOOR_QUALITY,
  CRACK_CONDITION,
  ANTI_SLIP,
  SURFACE_PROTECTION,
  type MaterialId,
  type FloorConditionId,
  type FloorQualityId,
  type CrackConditionId,
} from "../data/floorMaterials";
import type { PricingRule } from "../actions";

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
  pricingRules?: PricingRule[];       // 동적 가격 규칙 (신규)
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
 * 가격 규칙에서 값을 찾는 헬퍼
 */
function getPrice(rules: PricingRule[] | undefined, category: string, key: string, fallback: number): number {
  if (!rules) return fallback;
  const rule = rules.find(r => r.service_type === 'epoxy' && r.category === category && r.key === key);
  return rule ? Number(rule.value) : fallback;
}

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
    needsColorMixingFee,
    pricingRules
  } = input;

  // 동적 가격 로드 (fallback은 기존 상수)
  const prices = {
    // 면적별 (참고용 혹은 기본값)
    area_under_100: getPrice(pricingRules, 'area_base', 'area_under_100', 65000),
    area_101_299: getPrice(pricingRules, 'area_base', 'area_101_299', 45000),
    area_300_499: getPrice(pricingRules, 'area_base', 'area_300_499', 40000),
    area_over_500: getPrice(pricingRules, 'area_base', 'area_over_500', 35000),
    
    // 마감재별 기본 단가 (신규 추가)
    base_transparent: getPrice(pricingRules, 'material_base', 'transparent_epoxy', MATERIAL_PRICES.transparent_epoxy),
    base_solid: getPrice(pricingRules, 'material_base', 'solid_epoxy', MATERIAL_PRICES.solid_epoxy),
    base_gravel: getPrice(pricingRules, 'material_base', 'bean_gravel', MATERIAL_PRICES.bean_gravel),
    base_urethane: getPrice(pricingRules, 'material_base', 'urethane_waterproof', MATERIAL_PRICES.urethane_waterproof),

    quality_poor: getPrice(pricingRules, 'option', 'quality_poor', FLOOR_QUALITY.poor.price),
    crack_severe: getPrice(pricingRules, 'option', 'crack_severe', CRACK_CONDITION.severe.price),
    
    anti_slip: getPrice(pricingRules, 'option', 'anti_slip', ANTI_SLIP.price),
    surface_protection: getPrice(pricingRules, 'option', 'surface_protection', SURFACE_PROTECTION.price),
    
    self_leveling: getPrice(pricingRules, 'option', 'self_leveling', SELF_LEVELING_PRICE),
    color_mixing: getPrice(pricingRules, 'option', 'color_mixing', COLOR_MIXING_FEE),
    min_fee: getPrice(pricingRules, 'option', 'min_fee', MIN_SERVICE_FEE),
  };

  // 1. 기본 단가 결정 (마감재별 단가 우선 적용)
  let basePricePerM2: number;

  switch (materialId) {
    case "transparent_epoxy":
      basePricePerM2 = prices.base_transparent;
      break;
    case "solid_epoxy":
      basePricePerM2 = prices.base_solid;
      break;
    case "bean_gravel":
      basePricePerM2 = prices.base_gravel;
      break;
    case "urethane_waterproof":
      basePricePerM2 = prices.base_urethane;
      break;
    default:
      // Fallback: 면적별 차등 가격 (혹은 알 수 없는 마감재)
      if (area >= 500) basePricePerM2 = prices.area_over_500;
      else if (area >= 300) basePricePerM2 = prices.area_300_499;
      else if (area >= 101) basePricePerM2 = prices.area_101_299;
      else basePricePerM2 = prices.area_under_100;
  }

  // 2. 기본 시공비
  const basePrice = basePricePerM2 * area;

  // 3. 바닥 상태 추가 비용 (신규)
  const floorQualityPrice = floorQuality === 'poor' ? prices.quality_poor * area : 0;

  // 4. 균열 보수 추가 비용 (신규)
  const crackRepairPrice = crackCondition === 'severe' ? prices.crack_severe * area : 0;

  // 5. 미끄럼 방지 처리 (신규)
  const antiSlipPrice = includeAntiSlip ? prices.anti_slip * area : 0;

  // 6. 표면 보호막 (신규)
  const surfaceProtectionPrice = includeSurfaceProtection ? prices.surface_protection * area : 0;

  // 7. 셀프레벨링
  const selfLevelingPricePerM2 = includeSelfLeveling ? prices.self_leveling : 0;
  const selfLevelingPrice = selfLevelingPricePerM2 * area;

  // 8. 조색비 (고정 금액)
  const colorMixingFee = needsColorMixingFee ? prices.color_mixing : 0;

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
  const isMinFeeApplied = subtotal < prices.min_fee && subtotal > 0;
  const total = subtotal > 0 ? Math.max(subtotal, prices.min_fee) : 0;

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
