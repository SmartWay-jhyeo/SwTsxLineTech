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

// 마감재 데이터
export const FLOOR_MATERIALS: FloorMaterial[] = [
  {
    id: "transparent_epoxy",
    name: "투명 에폭시 (빈티지)",
    description: "콘크리트 질감을 살리는 투명 코팅",
    allowedFinishes: ["gloss", "semi_gloss", "matte"],
    allowedColors: ["clear"],
    thumbnail: "/images/epoxy/투명에폭시_유광.jpg"
  },
  {
    id: "solid_epoxy",
    name: "칼라 에폭시",
    description: "단색으로 깔끔하게 마감",
    allowedFinishes: ["gloss", "semi_gloss", "matte"],
    allowedColors: ["gray", "green", "blue", "red", "yellow", "black"],
    baseColors: ["gray", "green"],  // 조색비 없음
    thumbnail: "/images/epoxy/컬러에폭시_회색_유광(지하주차장).jpg"
  },
  {
    id: "bean_gravel",
    name: "콩자갈 바닥",
    description: "자연 자갈을 에폭시와 섞어 미장",
    allowedFinishes: ["natural"],
    allowedColors: ["beige", "white", "dark_pearl", "mix"],
    thumbnail: "/images/epoxy/콩자갈_베이지.jpg"
  },
  {
    id: "urethane_waterproof",
    name: "우레탄 방수",
    description: "옥상/실외 주차장 방수",
    allowedFinishes: ["gloss"],
    allowedColors: ["green", "gray"],
    thumbnail: "/images/epoxy/우레탄방수_초록색유광(빌라옥상).jpg"
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
    thumbnail: "/images/epoxy/투명에폭시_유광.jpg",
    gallery: [
      { src: "/images/epoxy/투명에폭시_유광.jpg", label: "유광", finish: "gloss" },
      { src: "/images/epoxy/투명에폭시_반광.jpg", label: "반광", finish: "semi_gloss" },
      { src: "/images/epoxy/투명에폭시_무광.jpg", label: "무광", finish: "matte" },
    ]
  },
  solid_epoxy: {
    thumbnail: "/images/epoxy/컬러에폭시_회색_유광(지하주차장).jpg",
    gallery: [
      { src: "/images/epoxy/컬러에폭시_회색_유광(지하주차장).jpg", label: "회색", color: "gray" },
      { src: "/images/epoxy/컬러에폭시_초록색_유광(지하주차장).jpg", label: "초록색", color: "green" },
      { src: "/images/epoxy/컬러에폭시_파란색_유광(전시회).jpg", label: "파란색", color: "blue" },
      { src: "/images/epoxy/컬러에폭시_빨간색_유광(전시회).jpg", label: "빨간색", color: "red" },
      { src: "/images/epoxy/컬러에폭시_노란색_유광(모델하우스).jpg", label: "노란색", color: "yellow" },
      { src: "/images/epoxy/컬러에폭시_검은색_유광(모델하우스).jpg", label: "검은색", color: "black" },
    ]
  },
  bean_gravel: {
    thumbnail: "/images/epoxy/콩자갈_베이지.jpg",
    gallery: [
      { src: "/images/epoxy/콩자갈_베이지.jpg", label: "베이지", color: "beige" },
      { src: "/images/epoxy/콩자갈_화이트.jpg", label: "화이트", color: "white" },
      { src: "/images/epoxy/콩자갈_믹스.jpg", label: "믹스", color: "mix" },
      { src: "/images/epoxy/콩자갈_흑진주.jpg", label: "흑진주", color: "dark_pearl" },
    ]
  },
  urethane_waterproof: {
    thumbnail: "/images/epoxy/우레탄방수_초록색유광(빌라옥상).jpg",
    gallery: [
      { src: "/images/epoxy/우레탄방수_초록색유광(빌라옥상).jpg", label: "초록색", color: "green" },
      { src: "/images/epoxy/우레탄방수_회색유광(빌라옥상).jpg", label: "회색", color: "gray" },
    ]
  }
};

// 셀프레벨링 정보 (체크박스 옵션)
export const SELF_LEVELING = {
  id: "self_leveling",
  name: "셀프레벨링",
  description: "바닥 수평 맞추기 기초작업 (선택)",
  thumbnail: "/images/epoxy/셀프레벨링.jpg"
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
