/**
 * 에폭시 바닥 시공 마감재/광택/색상 데이터
 */

// 마감재 타입
export type MaterialId =
  | "transparent_epoxy"
  | "solid_epoxy"
  | "bean_gravel"
  | "urethane_waterproof";

// 광택 타입
export type FinishId = "gloss" | "semi_gloss" | "matte" | "natural";

// 색상 타입
export type ColorId =
  | "clear"
  | "gray"
  | "green"
  | "blue"
  | "red"
  | "yellow"
  | "black"
  | "beige"
  | "white"
  | "dark_pearl"
  | "mix";

// 마감재 정의
export type FloorMaterial = {
  id: MaterialId;
  name: string;
  description: string;
  allowedFinishes: FinishId[];
  allowedColors: ColorId[];
  baseColors?: ColorId[];  // 조색비 없는 기본 색상
  thumbnail: string;
};

// 광택 정의
export type Finish = {
  name: string;
  description: string;
};

// 색상 정의
export type Color = {
  name: string;
  hex: string;
  isBaseColor?: boolean;
};

// 이미지 갤러리 아이템
export type GalleryImage = {
  src: string;
  label: string;
  color?: ColorId;
  finish?: FinishId;
};

// 이미지 캐시 버스팅 버전 (Next.js Image에서 쿼리스트링 문제로 제거)
const IMG_VERSION = "";

// 마감재 데이터
export const FLOOR_MATERIALS: FloorMaterial[] = [
  {
    id: "transparent_epoxy",
    name: "투명 에폭시 (빈티지)",
    description: "콘크리트 질감을 살리는 투명 코팅",
    allowedFinishes: ["gloss", "semi_gloss", "matte"],
    allowedColors: ["clear"],
    thumbnail: `/images/epoxy/transparent_gloss.jpg${IMG_VERSION}`
  },
  {
    id: "solid_epoxy",
    name: "칼라 에폭시",
    description: "단색으로 깔끔하게 마감",
    allowedFinishes: ["gloss", "semi_gloss", "matte"],
    allowedColors: ["gray", "green", "blue", "red", "yellow", "black"],
    baseColors: ["gray", "green"],  // 조색비 없음
    thumbnail: `/images/epoxy/color_gray_gloss.jpg${IMG_VERSION}`
  },
  {
    id: "bean_gravel",
    name: "콩자갈 바닥",
    description: "자연 자갈을 에폭시와 섞어 미장",
    allowedFinishes: ["natural"],
    allowedColors: ["beige", "white", "dark_pearl", "mix"],
    thumbnail: `/images/epoxy/gravel_beige.jpg${IMG_VERSION}`
  },
  {
    id: "urethane_waterproof",
    name: "우레탄 방수",
    description: "옥상/실외 주차장 방수",
    allowedFinishes: ["gloss"],
    allowedColors: ["green", "gray"],
    thumbnail: `/images/epoxy/urethane_green.jpg${IMG_VERSION}`
  }
];

// 광택 데이터
export const FINISHES: Record<FinishId, Finish> = {
  gloss: { name: "유광", description: "반짝이는 광택" },
  semi_gloss: { name: "반광", description: "은은한 광택" },
  matte: { name: "무광", description: "광택 없음" },
  natural: { name: "자연 질감", description: "자갈 본연의 텍스처" }
};

// 색상 데이터
export const COLORS: Record<ColorId, Color> = {
  clear: { name: "투명", hex: "transparent" },
  gray: { name: "회색", hex: "#6B7280" },
  green: { name: "녹색", hex: "#22C55E" },
  white: { name: "흰색", hex: "#FFFFFF" },
  blue: { name: "파랑", hex: "#3B82F6" },
  red: { name: "빨강", hex: "#EF4444" },
  yellow: { name: "노랑", hex: "#FACC15" },
  black: { name: "검정", hex: "#1F2937" },
  beige: { name: "베이지", hex: "#D4C4A8" },
  dark_pearl: { name: "흑진주", hex: "#2D3748" },
  mix: { name: "믹스", hex: "linear-gradient(135deg, #D4C4A8 25%, #FFFFFF 50%, #2D3748 75%)" }
};

// 마감재별 이미지 갤러리
export const MATERIAL_IMAGES: Record<MaterialId, { thumbnail: string; gallery: GalleryImage[] }> = {
  transparent_epoxy: {
    thumbnail: `/images/epoxy/transparent_gloss.jpg${IMG_VERSION}`,
    gallery: [
      { src: `/images/epoxy/transparent_gloss.jpg${IMG_VERSION}`, label: "유광", finish: "gloss" },
      { src: `/images/epoxy/transparent_semi.jpg${IMG_VERSION}`, label: "반광", finish: "semi_gloss" },
      { src: `/images/epoxy/transparent_matte.jpg${IMG_VERSION}`, label: "무광", finish: "matte" },
    ]
  },
  solid_epoxy: {
    thumbnail: `/images/epoxy/color_gray_gloss.jpg${IMG_VERSION}`,
    gallery: [
      { src: `/images/epoxy/color_gray_gloss.jpg${IMG_VERSION}`, label: "회색", color: "gray" },
      { src: `/images/epoxy/color_green_gloss.jpg${IMG_VERSION}`, label: "초록색", color: "green" },
      { src: `/images/epoxy/color_blue_gloss.jpg${IMG_VERSION}`, label: "파란색", color: "blue" },
      { src: `/images/epoxy/color_red_gloss.jpg${IMG_VERSION}`, label: "빨간색", color: "red" },
      { src: `/images/epoxy/color_yellow_gloss.jpg${IMG_VERSION}`, label: "노란색", color: "yellow" },
      { src: `/images/epoxy/color_black_gloss.jpg${IMG_VERSION}`, label: "검은색", color: "black" },
    ]
  },
  bean_gravel: {
    thumbnail: `/images/epoxy/gravel_beige.jpg${IMG_VERSION}`,
    gallery: [
      { src: `/images/epoxy/gravel_beige.jpg${IMG_VERSION}`, label: "베이지", color: "beige" },
      { src: `/images/epoxy/gravel_white.jpg${IMG_VERSION}`, label: "화이트", color: "white" },
      { src: `/images/epoxy/gravel_mix.jpg${IMG_VERSION}`, label: "믹스", color: "mix" },
      { src: `/images/epoxy/gravel_darkpearl.jpg${IMG_VERSION}`, label: "흑진주", color: "dark_pearl" },
    ]
  },
  urethane_waterproof: {
    thumbnail: `/images/epoxy/urethane_green.jpg${IMG_VERSION}`,
    gallery: [
      { src: `/images/epoxy/urethane_green.jpg${IMG_VERSION}`, label: "초록색", color: "green" },
      { src: `/images/epoxy/urethane_gray.jpg${IMG_VERSION}`, label: "회색", color: "gray" },
    ]
  }
};

// 셀프레벨링 정보 (체크박스 옵션)
export const SELF_LEVELING = {
  id: "self_leveling",
  name: "셀프레벨링",
  description: "바닥 수평 맞추기 기초작업 (선택)",
  thumbnail: `/images/epoxy/self_leveling.jpg${IMG_VERSION}`
};

// 바닥 상태 타입 (칼라 에폭시용)
export type FloorConditionId = "normal" | "poor_or_premium";

// 바닥 상태 옵션
export const FLOOR_CONDITIONS: Record<FloorConditionId, {
  name: string;
  description: string;
  method: string;
}> = {
  normal: {
    name: "일반",
    description: "바닥 상태가 양호함",
    method: "얇은 코팅 (롤러 시공)"
  },
  poor_or_premium: {
    name: "상태 불량 / 고급 마감",
    description: "파손이 심하거나 거울 같은 평활도 원함",
    method: "에폭시 라이닝 (두막형)"
  }
};

// 마감재별 옵션 동작 설정
export type SelfLevelingMode = "default_checked" | "optional" | "hidden";

export const MATERIAL_OPTIONS_CONFIG: Record<MaterialId, {
  selfLeveling: SelfLevelingMode;
  showFloorCondition: boolean;
  selfLevelingNote?: string;
}> = {
  transparent_epoxy: {
    selfLeveling: "default_checked",
    showFloorCondition: false,
    selfLevelingNote: "투명 에폭시는 셀프레벨링 없이 시공 시 마감이 고르지 않을 수 있습니다"
  },
  solid_epoxy: {
    selfLeveling: "hidden",
    showFloorCondition: true
  },
  bean_gravel: {
    selfLeveling: "hidden",
    showFloorCondition: false
  },
  urethane_waterproof: {
    selfLeveling: "hidden",
    showFloorCondition: false
  }
};

// 유틸리티 함수: 마감재 ID로 마감재 찾기
export function getMaterialById(id: MaterialId): FloorMaterial | undefined {
  return FLOOR_MATERIALS.find(m => m.id === id);
}

// 유틸리티 함수: 마감재에 허용된 광택 목록 가져오기
export function getFinishesForMaterial(materialId: MaterialId): { id: FinishId; name: string; description: string }[] {
  const material = getMaterialById(materialId);
  if (!material) return [];

  return material.allowedFinishes.map(finishId => ({
    id: finishId,
    ...FINISHES[finishId]
  }));
}

// 유틸리티 함수: 마감재에 허용된 색상 목록 가져오기
export function getColorsForMaterial(materialId: MaterialId): { id: ColorId; name: string; hex: string; isBaseColor: boolean }[] {
  const material = getMaterialById(materialId);
  if (!material) return [];

  return material.allowedColors.map(colorId => ({
    id: colorId,
    ...COLORS[colorId],
    isBaseColor: material.baseColors?.includes(colorId) ?? true
  }));
}

// 유틸리티 함수: 조색비 필요 여부 확인
export function requiresColorMixingFee(materialId: MaterialId, colorId: ColorId): boolean {
  const material = getMaterialById(materialId);
  if (!material || !material.baseColors) return false;

  return !material.baseColors.includes(colorId);
}

// ==========================================
// 가격 데이터 (부가세 별도)
// ==========================================

// 마감재별 기본 단가 (m² 당)
export const MATERIAL_PRICES: Record<MaterialId, number> = {
  transparent_epoxy: 45000,    // 투명 에폭시 (평당 15만원)
  solid_epoxy: 45000,          // 칼라 에폭시 - 일반 바닥상태 기준
  bean_gravel: 55000,          // 콩자갈 (평당 18만원)
  urethane_waterproof: 35000,  // 우레탄 방수 (평당 10만원)
};

// 칼라 에폭시 바닥 상태별 단가 (m² 당)
export const FLOOR_CONDITION_PRICES: Record<FloorConditionId, number> = {
  normal: 45000,           // 얇은 코팅 (롤러 시공)
  poor_or_premium: 60000,  // 에폭시 라이닝 (두막형)
};

// 셀프레벨링 추가 단가 (m² 당)
export const SELF_LEVELING_PRICE = 30000;

// 조색비 (고정)
export const COLOR_MIXING_FEE = 50000;

// 최소 출장비
export const MIN_SERVICE_FEE = 300000;

// ==========================================
// 새로운 면적별/옵션별 가격 체계 (고객 친화적 용어)
// ==========================================

/**
 * 면적에 따른 기본 단가 계산
 * - 500㎡ 이상: 35,000원/㎡
 * - 300-499㎡: 40,000원/㎡
 * - 101-299㎡: 45,000원/㎡
 * - 100㎡ 미만: 65,000원/㎡
 */
export function getBasePriceByArea(area: number): number {
  if (area >= 500) return 35000;
  if (area >= 300) return 40000;
  if (area >= 101) return 45000;
  return 65000; // 100㎡ 미만
}

// 바닥 상태 타입 (고객 친화적)
export type FloorQualityId = "good" | "normal" | "poor";

// 바닥 상태 옵션 (고객 친화적 설명)
export const FLOOR_QUALITY: Record<FloorQualityId, {
  name: string;
  description: string;
  price: number;
}> = {
  good: {
    name: "양호",
    description: "바닥이 깨끗하고 평평함",
    price: 0
  },
  normal: {
    name: "보통",
    description: "일반적인 바닥 상태",
    price: 0
  },
  poor: {
    name: "불량",
    description: "균열이 많거나 파손이 심함",
    price: 15000  // ㎡당 추가 비용
  }
};

// 균열 상태 타입 (고객 친화적)
export type CrackConditionId = "minor" | "moderate" | "severe";

// 균열 상태 옵션 (고객 친화적 설명)
export const CRACK_CONDITION: Record<CrackConditionId, {
  name: string;
  description: string;
  price: number;
}> = {
  minor: {
    name: "미세",
    description: "눈에 거의 보이지 않는 작은 균열",
    price: 0
  },
  moderate: {
    name: "보통",
    description: "일부 균열이 있으나 심하지 않음",
    price: 0
  },
  severe: {
    name: "심각",
    description: "큰 균열 또는 누수 의심",
    price: 30000  // ㎡당 추가 비용
  }
};

// 미끄럼 방지 처리 (기존 "엠보 시공")
export const ANTI_SLIP = {
  id: "anti_slip",
  name: "미끄럼 방지 처리",
  description: "바닥에 요철을 만들어 미끄럼을 방지합니다. 가벼운 하중, 미관개선, 먼지방지, 일반 주차장이나 상가바닥",
  price: 7500  // ㎡당 추가 비용 (5,000-10,000 평균)
};

// 표면 보호막 (기존 "상도 코팅")
export const SURFACE_PROTECTION = {
  id: "surface_protection",
  name: "표면 보호막 추가",
  description: "마모와 오염을 더 잘 방지합니다. 중하중, 내마모성, 내충격성 강화, 공장, 창고, 물류센터 등",
  price: 7500  // ㎡당 추가 비용 (5,000-10,000 평균)
};

// 평(pyeong) 변환 상수
export const SQM_TO_PYEONG = 0.3025;  // 1㎡ = 0.3025평
export const PYEONG_TO_SQM = 3.3058;  // 1평 = 3.3058㎡
