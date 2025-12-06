/**
 * 주차장 면적 기반 자동 계산 유틸리티
 *
 * 법적 기준 (2025년):
 * - 지상 주차장: 1대당 약 28㎡ (주차면 + 통로)
 * - 지하 주차장: 1대당 약 33㎡ (기둥, 램프 등 추가 공간)
 * - 장애인 주차: 2~4% (10대 이상, 3% 적용)
 * - 전기차 충전: 5% 신축 / 2% 기축
 */

export type ParkingCalculationResult = {
  totalSpots: number;
  regularSpots: number;
  disabledSpots: number;
  evSpots: number;
};

// 주차장 위치 유형
export type LocationType = 'ground' | 'underground';

// 1대당 소요 면적 (주차면 + 통로 + 기타)
const AREA_PER_SPOT = {
  ground: 28,       // 지상: 28m²/대
  underground: 33,  // 지하: 33m²/대 (기둥, 램프 등)
} as const;

// 장애인 주차 비율 (3%)
const DISABLED_RATIO = 0.03;

// 전기차 충전 비율 (신축 5%)
const EV_RATIO = 0.05;

/**
 * 면적 기반 주차 구획 자동 계산
 * @param areaSqm 총 면적 (m²)
 * @param locationType 주차장 위치 (지상/지하)
 * @returns 주차 구획 계산 결과
 */
export function calculateParkingSpots(
  areaSqm: number,
  locationType: LocationType = 'ground'
): ParkingCalculationResult {
  // 위치에 따른 면적 계수 적용
  const areaPerSpot = AREA_PER_SPOT[locationType];

  // 총 주차대수 계산
  const totalSpots = Math.floor(areaSqm / areaPerSpot);

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

// 구간별 정액 가격 (전체 대수 기준)
const PRICES = {
  tiers: [
    { max: 20, price: 800000 },    // 1~20대: 80만원
    { max: 100, price: 1250000 },  // 21~100대: 125만원
    { max: 200, price: 2400000 },  // 101~200대: 240만원
  ],
  specialSpot: 250000,  // 장애인/전기차 면당 25만원 추가
} as const;

export type PriceCalculationInput = {
  regularSpots: number;
  disabledSpots: number;
  evChargingSpots: number;
};

export type PriceCalculationResult = {
  basePrice: number;       // 구간 정액
  specialPrice: number;    // 특수구역 추가금
  total: number;
  needsConsultation: boolean;  // 200대 초과 시 true
  formatted: string; // "약 XXX만원" 또는 "별도 협의"
};

/**
 * 예상 견적 금액 계산
 * @param input 주차칸 개수 데이터
 * @returns 가격 계산 결과
 */
export function calculateEstimatedPrice(input: PriceCalculationInput): PriceCalculationResult {
  const regularSpots = input.regularSpots;
  const specialSpots = input.disabledSpots + input.evChargingSpots;

  // 일반 대수 200대 초과: 협의 필요
  if (regularSpots > 200) {
    return {
      basePrice: 0,
      specialPrice: 0,
      total: 0,
      needsConsultation: true,
      formatted: "별도 협의",
    };
  }

  // 0대: 빈 결과
  if (regularSpots === 0 && specialSpots === 0) {
    return {
      basePrice: 0,
      specialPrice: 0,
      total: 0,
      needsConsultation: false,
      formatted: "0원",
    };
  }

  // 구간별 정액 (일반 대수만 기준, 장애인/전기차는 별도 추가금)
  let basePrice = 0;
  if (regularSpots > 0) {
    basePrice = PRICES.tiers[PRICES.tiers.length - 1].price; // 기본값: 가장 큰 구간
    for (const tier of PRICES.tiers) {
      if (regularSpots <= tier.max) {
        basePrice = tier.price;
        break;
      }
    }
  }

  // 특수구역 추가금 (장애인/전기차는 별도)
  const specialPrice = specialSpots * PRICES.specialSpot;
  const total = basePrice + specialPrice;

  return {
    basePrice,
    specialPrice,
    total,
    needsConsultation: false,
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
  tiers: PRICES.tiers,
  specialSpot: PRICES.specialSpot,
} as const;
