/**
 * 주차장 면적 기반 자동 계산 유틸리티
 *
 * 법적 기준 (2025년):
 * - 1대당 면적: 약 30㎡ (주차면 12.5㎡ + 통로)
 * - 장애인 주차: 2~4% (10대 이상, 3% 적용)
 * - 전기차 충전: 5% 신축 / 2% 기축
 */

export type ParkingCalculationResult = {
  totalSpots: number;
  regularSpots: number;
  disabledSpots: number;
  evSpots: number;
};

// 1대당 소요 면적 (주차면 + 통로 + 기타)
const AREA_PER_SPOT = 30;

// 장애인 주차 비율 (3%)
const DISABLED_RATIO = 0.03;

// 전기차 충전 비율 (신축 5%)
const EV_RATIO = 0.05;

/**
 * 면적 기반 주차 구획 자동 계산
 * @param areaSqm 총 면적 (m²)
 * @returns 주차 구획 계산 결과
 */
export function calculateParkingSpots(areaSqm: number): ParkingCalculationResult {
  // 총 주차대수 계산
  const totalSpots = Math.floor(areaSqm / AREA_PER_SPOT);

  if (totalSpots <= 0) {
    return {
      totalSpots: 0,
      regularSpots: 0,
      disabledSpots: 0,
      evSpots: 0,
    };
  }

  // 장애인 주차칸 (10대 이상일 때만, 최소 1대)
  const disabledSpots = totalSpots >= 10
    ? Math.max(1, Math.ceil(totalSpots * DISABLED_RATIO))
    : 0;

  // 전기차 충전칸 (20대 이상일 때만, 최소 1대)
  const evSpots = totalSpots >= 20
    ? Math.max(1, Math.ceil(totalSpots * EV_RATIO))
    : 0;

  // 일반 주차칸 (나머지)
  const regularSpots = Math.max(0, totalSpots - disabledSpots - evSpots);

  return {
    totalSpots,
    regularSpots,
    disabledSpots,
    evSpots,
  };
}

/**
 * 면적을 포맷팅하여 반환
 * @param areaSqm 면적 (m²)
 * @returns 포맷된 문자열
 */
export function formatArea(areaSqm: number): string {
  return areaSqm.toLocaleString("ko-KR", { maximumFractionDigits: 1 });
}

/**
 * 주차칸 요약 텍스트 생성
 * @param result 계산 결과
 * @returns 요약 텍스트
 */
export function getParkingSummary(result: ParkingCalculationResult): string {
  const parts: string[] = [];

  if (result.totalSpots > 0) {
    parts.push(`총 ${result.totalSpots}대`);
  }
  if (result.disabledSpots > 0) {
    parts.push(`장애인 ${result.disabledSpots}대`);
  }
  if (result.evSpots > 0) {
    parts.push(`전기차 ${result.evSpots}대`);
  }

  return parts.join(" / ");
}

// ==========================================
// 가격 계산 관련
// ==========================================

// 주차칸별 단가 (원)
const PRICES = {
  regular: 30000,       // 일반 주차칸
  disabled: 50000,      // 장애인 주차칸
  ev: 50000,            // 전기차 충전칸
  minMobilization: 300000, // 최소 출장비
} as const;

export type PriceCalculationInput = {
  regularSpots: number;
  disabledSpots: number;
  evChargingSpots: number;
};

export type PriceCalculationResult = {
  subtotal: number;
  total: number;
  isMinimumApplied: boolean;
  formatted: string; // "약 XXX만원"
};

/**
 * 예상 견적 금액 계산
 * @param input 주차칸 개수 데이터
 * @returns 가격 계산 결과
 */
export function calculateEstimatedPrice(input: PriceCalculationInput): PriceCalculationResult {
  const subtotal =
    input.regularSpots * PRICES.regular +
    input.disabledSpots * PRICES.disabled +
    input.evChargingSpots * PRICES.ev;

  const isMinimumApplied = subtotal < PRICES.minMobilization && subtotal > 0;
  const total = subtotal > 0 ? Math.max(subtotal, PRICES.minMobilization) : 0;

  return {
    subtotal,
    total,
    isMinimumApplied,
    formatted: formatPriceToMan(total),
  };
}

/**
 * 금액을 "약 XXX만원" 형태로 포맷팅
 * @param price 가격 (원)
 * @returns 포맷된 문자열
 */
function formatPriceToMan(price: number): string {
  if (price === 0) return "0원";
  const man = Math.round(price / 10000);
  return `약 ${man.toLocaleString("ko-KR")}만원`;
}

/**
 * 가격 상수 조회 (외부 참조용)
 */
export const PRICE_INFO = {
  regular: PRICES.regular,
  disabled: PRICES.disabled,
  ev: PRICES.ev,
  minMobilization: PRICES.minMobilization,
} as const;
