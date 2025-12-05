"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Check, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FLOOR_MATERIALS,
  FINISHES,
  COLORS,
  MATERIAL_IMAGES,
  SELF_LEVELING,
  getFinishesForMaterial,
  getColorsForMaterial,
  requiresColorMixingFee,
  type MaterialId,
  type FinishId,
  type ColorId,
} from "../data/floorMaterials";

export function EpoxyQuoteForm() {
  // 선택 상태
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialId | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<FinishId | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorId | null>(null);
  const [includeSelfLeveling, setIncludeSelfLeveling] = useState(false);

  // 연락처 정보
  const [contactData, setContactData] = useState({
    location: "",
    area: "",
    name: "",
    phone: "",
    notes: "",
  });

  // 이미지 갤러리 스크롤 ref
  const galleryRef = useRef<HTMLDivElement>(null);

  // 마감재가 변경되면 광택/색상 초기화
  const handleMaterialChange = (materialId: MaterialId) => {
    setSelectedMaterial(materialId);
    setSelectedFinish(null);
    setSelectedColor(null);
  };

  // 선택된 마감재에 맞는 광택 옵션
  const availableFinishes = useMemo(() => {
    if (!selectedMaterial) return [];
    return getFinishesForMaterial(selectedMaterial);
  }, [selectedMaterial]);

  // 선택된 마감재에 맞는 색상 옵션
  const availableColors = useMemo(() => {
    if (!selectedMaterial) return [];
    return getColorsForMaterial(selectedMaterial);
  }, [selectedMaterial]);

  // 현재 선택된 마감재의 이미지 갤러리
  const currentGallery = useMemo(() => {
    if (!selectedMaterial) return [];
    return MATERIAL_IMAGES[selectedMaterial]?.gallery || [];
  }, [selectedMaterial]);

  // 조색비 필요 여부
  const needsColorMixingFee = useMemo(() => {
    if (!selectedMaterial || !selectedColor) return false;
    return requiresColorMixingFee(selectedMaterial, selectedColor);
  }, [selectedMaterial, selectedColor]);

  // 갤러리 스크롤
  const scrollGallery = (direction: "left" | "right") => {
    if (!galleryRef.current) return;
    const scrollAmount = 200;
    galleryRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // 제출 핸들러
  const handleSubmit = () => {
    if (!selectedMaterial) {
      alert("마감재를 선택해주세요.");
      return;
    }
    if (availableFinishes.length > 0 && !selectedFinish) {
      alert("광택을 선택해주세요.");
      return;
    }
    if (availableColors.length > 0 && !selectedColor) {
      alert("색상을 선택해주세요.");
      return;
    }
    if (!contactData.phone) {
      alert("연락처를 입력해주세요.");
      return;
    }

    const material = FLOOR_MATERIALS.find(m => m.id === selectedMaterial);
    const finish = selectedFinish ? FINISHES[selectedFinish] : null;
    const color = selectedColor ? COLORS[selectedColor] : null;

    const quoteData = {
      serviceType: "epoxy",
      material: material?.name,
      finish: finish?.name,
      color: color?.name,
      colorMixingFee: needsColorMixingFee,
      selfLeveling: includeSelfLeveling,
      ...contactData,
    };

    console.log("견적 요청 데이터:", quoteData);
    alert("견적 요청이 접수되었습니다!\n담당자가 빠른 시일 내에 연락드리겠습니다.");
  };

  return (
    <div className="space-y-8">
      {/* 1. 마감재 선택 */}
      <section className="space-y-4">
        <h3 className="text-white text-sm font-medium">마감재 종류</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FLOOR_MATERIALS.map((material) => (
            <button
              key={material.id}
              type="button"
              onClick={() => handleMaterialChange(material.id)}
              className={cn(
                "relative group overflow-hidden rounded-lg transition-all duration-200",
                "border-2",
                selectedMaterial === material.id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-white/20 hover:border-white/40"
              )}
            >
              {/* 썸네일 이미지 */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={material.thumbnail}
                  alt={material.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* 선택 체크 */}
                {selectedMaterial === material.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
                {/* 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              {/* 라벨 */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium">{material.name}</p>
                <p className="text-white/60 text-xs mt-0.5">{material.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. 이미지 갤러리 (마감재 선택 시) */}
      {selectedMaterial && currentGallery.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-white text-sm font-medium">시공 예시</h3>
          <div className="relative">
            {/* 좌측 스크롤 버튼 */}
            <button
              type="button"
              onClick={() => scrollGallery("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            {/* 이미지 스크롤 영역 */}
            <div
              ref={galleryRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide px-10 py-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {currentGallery.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative shrink-0 w-48 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all",
                    // 색상 또는 광택이 일치하면 하이라이트
                    (image.color && image.color === selectedColor) ||
                    (image.finish && image.finish === selectedFinish)
                      ? "border-primary"
                      : "border-transparent"
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.label}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                    <p className="text-white text-xs text-center">{image.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 우측 스크롤 버튼 */}
            <button
              type="button"
              onClick={() => scrollGallery("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>
      )}

      {/* 3. 광택 선택 (마감재에 따라 동적) */}
      {selectedMaterial && availableFinishes.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-white text-sm font-medium">광택 선택</h3>
          <div className="flex flex-wrap gap-2">
            {availableFinishes.map((finish) => (
              <button
                key={finish.id}
                type="button"
                onClick={() => setSelectedFinish(finish.id)}
                className={cn(
                  "px-4 py-2.5 rounded-lg transition-all duration-200",
                  "border text-sm",
                  selectedFinish === finish.id
                    ? "bg-primary border-primary text-white"
                    : "bg-transparent border-white/20 text-white/70 hover:border-white/40"
                )}
              >
                <span>{finish.name}</span>
                <span className="block text-xs opacity-70">{finish.description}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 4. 색상 선택 (마감재에 따라 동적) */}
      {selectedMaterial && availableColors.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-white text-sm font-medium">색상 선택</h3>
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setSelectedColor(color.id)}
                className={cn(
                  "relative group transition-all duration-200",
                  "ring-offset-background ring-offset-2",
                  selectedColor === color.id && "ring-2 ring-primary"
                )}
                title={color.name}
              >
                {/* 색상 원 */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full border-2",
                    color.id === "clear" ? "border-white/40" : "border-white/20",
                    color.id === "mix" && "overflow-hidden"
                  )}
                  style={{
                    background: color.id === "clear"
                      ? "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50%/16px 16px"
                      : color.hex.startsWith("linear")
                        ? color.hex
                        : color.hex,
                    backgroundColor: color.id !== "clear" && !color.hex.startsWith("linear") ? color.hex : undefined,
                  }}
                >
                  {selectedColor === color.id && (
                    <Check
                      size={18}
                      className={cn(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                        color.hex === "#FFFFFF" || color.hex === "#FACC15" || color.id === "clear"
                          ? "text-black"
                          : "text-white"
                      )}
                    />
                  )}
                </div>
                {/* 색상 이름 */}
                <p className="text-xs text-white/70 text-center mt-1">{color.name}</p>
                {/* 조색비 표시 */}
                {!color.isBaseColor && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-black font-bold">+</span>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 조색비 안내 */}
          {needsColorMixingFee && (
            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertCircle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-yellow-500 text-xs">
                선택하신 색상은 기본 색상이 아니므로 조색비가 추가됩니다.
              </p>
            </div>
          )}

          {selectedColor && (
            <p className="text-xs text-white/50">
              선택됨: {COLORS[selectedColor].name}
            </p>
          )}
        </section>
      )}

      {/* 5. 셀프레벨링 체크박스 */}
      <section className="space-y-3">
        <label className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
          <input
            type="checkbox"
            checked={includeSelfLeveling}
            onChange={(e) => setIncludeSelfLeveling(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-white/30 bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-medium">{SELF_LEVELING.name}</span>
              <span className="text-xs text-white/50 px-2 py-0.5 bg-white/10 rounded">선택</span>
            </div>
            <p className="text-white/60 text-xs mt-1">{SELF_LEVELING.description}</p>
          </div>
          <div className="relative w-16 h-12 rounded overflow-hidden shrink-0">
            <Image
              src={SELF_LEVELING.thumbnail}
              alt={SELF_LEVELING.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        </label>
      </section>

      {/* 6. 연락처 정보 */}
      <section className="space-y-3">
        <h3 className="text-white text-sm font-medium">시공 정보</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={contactData.location}
            onChange={(e) => setContactData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="시공 장소 (예: 서울시 강남구)"
            className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
          />
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2">
              <input
                type="number"
                value={contactData.area}
                onChange={(e) => setContactData(prev => ({ ...prev, area: e.target.value }))}
                placeholder="면적"
                className="flex-1 bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
              />
              <span className="text-white/70 text-sm">m²</span>
            </div>
            <input
              type="text"
              value={contactData.name}
              onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="담당자 이름"
              className="flex-1 bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
            />
          </div>
          <input
            type="tel"
            value={contactData.phone}
            onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="연락처 (필수) *"
            className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
          />
          <textarea
            value={contactData.notes}
            onChange={(e) => setContactData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="추가 요청사항"
            rows={3}
            className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary resize-none"
          />
        </div>
      </section>

      {/* 7. 제출 버튼 */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full flex items-center justify-center gap-2 h-14 bg-primary rounded-full text-white font-medium hover:opacity-90 transition-opacity"
      >
        <span>견적 요청하기</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
