"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Check, ChevronLeft, ChevronRight, AlertCircle, ChevronUp, ChevronDown, Calculator, Loader2, Upload, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import { submitQuote, type EpoxyQuoteInput } from "../actions";
import { cn } from "@/lib/utils";
import {
  FLOOR_MATERIALS,
  FINISHES,
  COLORS,
  MATERIAL_IMAGES,
  SELF_LEVELING,
  FLOOR_CONDITIONS,
  MATERIAL_OPTIONS_CONFIG,
  FLOOR_QUALITY,
  CRACK_CONDITION,
  ANTI_SLIP,
  SURFACE_PROTECTION,
  SQM_TO_PYEONG,
  getFinishesForMaterial,
  getColorsForMaterial,
  requiresColorMixingFee,
  type MaterialId,
  type FinishId,
  type ColorId,
  type FloorConditionId,
  type FloorQualityId,
  type CrackConditionId,
} from "../data/floorMaterials";
import {
  calculateEpoxyPrice,
  formatPrice,
  sqmToPyeong,
  type PriceBreakdown,
} from "../utils/epoxyPriceCalculator";

export function EpoxyQuoteForm() {
  // 선택 상태
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialId | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<FinishId | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorId | null>(null);
  const [includeSelfLeveling, setIncludeSelfLeveling] = useState(false);
  const [floorCondition, setFloorCondition] = useState<FloorConditionId | null>(null);

  // 면적 (m²)
  const [area, setArea] = useState<string>("");

  // 연락처 정보
  const [contactData, setContactData] = useState({
    location: "",
    name: "",
    phone: "",
    notes: "",
  });

  // 신규 옵션 (고객 친화적)
  const [floorQuality, setFloorQuality] = useState<FloorQualityId>("normal"); // 기본값: 보통
  const [crackCondition, setCrackCondition] = useState<CrackConditionId>("moderate"); // 기본값: 보통
  const [includeAntiSlip, setIncludeAntiSlip] = useState(false);
  const [includeSurfaceProtection, setIncludeSurfaceProtection] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false); // 고급 옵션 접기/펼치기

  // 사진 첨부
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  // 모바일 견적 패널 펼침 상태
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미지 갤러리 스크롤 ref
  const galleryRef = useRef<HTMLDivElement>(null);

  // 마감재가 변경되면 광택/색상/옵션 초기화
  const handleMaterialChange = (materialId: MaterialId) => {
    setSelectedMaterial(materialId);
    setSelectedFinish(null);
    setSelectedColor(null);
    setFloorCondition(null);

    // 마감재별 셀프레벨링 기본값 설정
    const config = MATERIAL_OPTIONS_CONFIG[materialId];
    if (config.selfLeveling === "default_checked") {
      setIncludeSelfLeveling(true);
    } else {
      setIncludeSelfLeveling(false);
    }
  };

  // 현재 마감재의 옵션 설정
  const currentOptionsConfig = useMemo(() => {
    if (!selectedMaterial) return null;
    return MATERIAL_OPTIONS_CONFIG[selectedMaterial];
  }, [selectedMaterial]);

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

  // 가격 계산 (신규 옵션 포함)
  const priceBreakdown = useMemo((): PriceBreakdown | null => {
    if (!selectedMaterial) return null;

    const areaNum = parseFloat(area) || 0;
    if (areaNum <= 0) return null;

    return calculateEpoxyPrice({
      materialId: selectedMaterial,
      area: areaNum,
      floorCondition: floorCondition || undefined,
      floorQuality, // 신규
      crackCondition, // 신규
      includeAntiSlip, // 신규
      includeSurfaceProtection, // 신규
      includeSelfLeveling,
      needsColorMixingFee,
    });
  }, [selectedMaterial, area, floorCondition, floorQuality, crackCondition, includeAntiSlip, includeSurfaceProtection, includeSelfLeveling, needsColorMixingFee]);

  // 현재 마감재 정보
  const currentMaterial = useMemo(() => {
    if (!selectedMaterial) return null;
    return FLOOR_MATERIALS.find(m => m.id === selectedMaterial);
  }, [selectedMaterial]);

  // 갤러리 스크롤
  const scrollGallery = (direction: "left" | "right") => {
    if (!galleryRef.current) return;
    const scrollAmount = 200;
    galleryRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // 사진 압축 및 업로드 핸들러
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 최대 3장 제한
    if (photos.length + files.length > 3) {
      alert("사진은 최대 3장까지 첨부 가능합니다.");
      return;
    }

    setIsCompressing(true);

    try {
      const compressedFiles: File[] = [];
      const previewUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 이미지 압축 옵션
        const options = {
          maxSizeMB: 0.3, // 최대 300KB
          maxWidthOrHeight: 1920, // 최대 너비/높이
          useWebWorker: true,
          fileType: "image/jpeg", // JPEG로 변환
        };

        // 압축 실행
        const compressedFile = await imageCompression(file, options);
        compressedFiles.push(compressedFile);

        // 미리보기 URL 생성
        const previewUrl = URL.createObjectURL(compressedFile);
        previewUrls.push(previewUrl);
      }

      setPhotos(prev => [...prev, ...compressedFiles]);
      setPhotoPreviewUrls(prev => [...prev, ...previewUrls]);
    } catch (error) {
      console.error("사진 압축 실패:", error);
      alert("사진 처리 중 오류가 발생했습니다.");
    } finally {
      setIsCompressing(false);
      // input 초기화
      e.target.value = "";
    }
  };

  // 사진 삭제 핸들러
  const handlePhotoRemove = (index: number) => {
    // 미리보기 URL 해제
    URL.revokeObjectURL(photoPreviewUrls[index]);

    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // 제출 핸들러
  const handleSubmit = async () => {
    if (!selectedMaterial) {
      alert("마감재를 선택해주세요.");
      return;
    }
    if (!area || parseFloat(area) <= 0) {
      alert("면적을 입력해주세요.");
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
    // 칼라 에폭시는 바닥 상태 필수
    if (currentOptionsConfig?.showFloorCondition && !floorCondition) {
      alert("바닥 상태를 선택해주세요.");
      return;
    }
    if (!contactData.phone) {
      alert("연락처를 입력해주세요.");
      return;
    }

    const material = FLOOR_MATERIALS.find(m => m.id === selectedMaterial);
    const finish = selectedFinish ? FINISHES[selectedFinish] : null;
    const color = selectedColor ? COLORS[selectedColor] : null;
    const condition = floorCondition ? FLOOR_CONDITIONS[floorCondition] : null;

    // 선택한 옵션들을 요약 텍스트로 생성
    const optionsSummary = [
      `[마감재] ${material?.name || "-"}`,
      finish ? `[광택] ${finish.name}` : null,
      color ? `[색상] ${color.name}${needsColorMixingFee ? " (조색비 추가)" : ""}` : null,
      condition ? `[바닥상태] ${condition.name} → ${condition.method}` : null,
      includeSelfLeveling ? `[셀프레벨링] 포함` : null,
      contactData.location ? `[시공장소] ${contactData.location}` : null,
    ].filter(Boolean).join("\n");

    const fullNotes = contactData.notes
      ? `${optionsSummary}\n\n[추가요청]\n${contactData.notes}`
      : optionsSummary;

    // 서버 액션에 맞는 데이터 형식으로 변환
    const quoteData: EpoxyQuoteInput = {
      service_type: "epoxy",
      area: parseFloat(area),
      surface_condition: condition?.name || "normal",
      contact_name: contactData.name,
      contact_phone: contactData.phone,
      notes: fullNotes,
      options: {
        material: material?.name || "",
        finish: finish?.name,
        color: color?.name,
        colorMixingFee: needsColorMixingFee,
        selfLeveling: includeSelfLeveling,
        floorCondition: condition?.name,
        applicationMethod: condition?.method,
        location: contactData.location,
      },
      base_cost: priceBreakdown?.basePrice || 0,
      option_cost: (priceBreakdown?.selfLevelingPrice || 0) + (priceBreakdown?.colorMixingFee || 0),
      surcharge: 0,
      total_cost: priceBreakdown?.total || 0,
      is_minimum_applied: priceBreakdown?.isMinFeeApplied || false,
    };

    setIsSubmitting(true);
    try {
      const result = await submitQuote(quoteData);

      if (result.success) {
        alert("견적 요청이 접수되었습니다!\n담당자가 빠른 시일 내에 연락드리겠습니다.");
        // 폼 초기화
        setSelectedMaterial(null);
        setSelectedFinish(null);
        setSelectedColor(null);
        setIncludeSelfLeveling(false);
        setFloorCondition(null);
        setArea("");
        setContactData({ location: "", name: "", phone: "", notes: "" });
      } else {
        alert("견적 요청 중 오류가 발생했습니다.\n" + (result.error || "다시 시도해주세요."));
      }
    } catch {
      alert("견적 요청 중 오류가 발생했습니다.\n다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 견적 패널 컴포넌트
  const QuoteSummaryPanel = ({ className, isMobile = false }: { className?: string; isMobile?: boolean }) => {
    const areaNum = parseFloat(area) || 0;

    if (!selectedMaterial) {
      return (
        <div className={cn("bg-white/5 rounded-xl p-6 border border-white/10", className)}>
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={20} className="text-primary" />
            <h3 className="text-white font-medium">예상 견적</h3>
          </div>
          <p className="text-white/50 text-sm">마감재를 선택하면 예상 견적이 표시됩니다</p>
        </div>
      );
    }

    if (areaNum <= 0) {
      return (
        <div className={cn("bg-white/5 rounded-xl p-6 border border-white/10", className)}>
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={20} className="text-primary" />
            <h3 className="text-white font-medium">예상 견적</h3>
          </div>
          <p className="text-white/50 text-sm">면적을 입력하면 예상 견적이 표시됩니다</p>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="면적 입력"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
            />
            <span className="text-white/70 text-sm">m²</span>
          </div>
        </div>
      );
    }

    if (!priceBreakdown) return null;

    return (
      <div className={cn("bg-white/5 rounded-xl p-6 border border-white/10", className)}>
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={20} className="text-primary" />
          <h3 className="text-white font-medium">예상 견적</h3>
        </div>

        {/* 면적 */}
        <div className="mb-4 pb-4 border-b border-white/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/70">시공 면적</span>
            <span className="text-white font-medium">{areaNum} m² ({sqmToPyeong(areaNum)}평)</span>
          </div>
        </div>

        {/* 항목별 가격 */}
        <div className="space-y-3 mb-4">
          {/* 기본 시공비 (면적별 차등 가격) */}
          <div>
            <div className="flex justify-between items-start text-sm">
              <div>
                <span className="text-white">{currentMaterial?.name}</span>
                {selectedMaterial === "solid_epoxy" && floorCondition && (
                  <span className="text-white/50 text-xs ml-1">
                    ({FLOOR_CONDITIONS[floorCondition].method})
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-white/50 mt-0.5">
              <span>{formatPrice(priceBreakdown.basePricePerM2)}/m²({formatPrice(Math.round(priceBreakdown.basePricePerM2 * SQM_TO_PYEONG))}/평) × {areaNum}</span>
              <span className="text-white">{formatPrice(priceBreakdown.basePrice)}</span>
            </div>
          </div>

          {/* 바닥 상태 추가 비용 (신규) */}
          {priceBreakdown.floorQualityPrice > 0 && (
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-orange-400">+ 바닥 보수 작업</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/50 mt-0.5">
                <span>15,000원/m² × {areaNum}</span>
                <span className="text-orange-400">{formatPrice(priceBreakdown.floorQualityPrice)}</span>
              </div>
            </div>
          )}

          {/* 균열 보수 추가 비용 (신규) */}
          {priceBreakdown.crackRepairPrice > 0 && (
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-red-400">+ 균열 보수</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/50 mt-0.5">
                <span>30,000원/m² × {areaNum}</span>
                <span className="text-red-400">{formatPrice(priceBreakdown.crackRepairPrice)}</span>
              </div>
            </div>
          )}

          {/* 미끄럼 방지 처리 (신규) */}
          {priceBreakdown.antiSlipPrice > 0 && (
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-400">+ {ANTI_SLIP.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/50 mt-0.5">
                <span>{formatPrice(ANTI_SLIP.price)}/m² × {areaNum}</span>
                <span className="text-blue-400">{formatPrice(priceBreakdown.antiSlipPrice)}</span>
              </div>
            </div>
          )}

          {/* 표면 보호막 (신규) */}
          {priceBreakdown.surfaceProtectionPrice > 0 && (
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-400">+ {SURFACE_PROTECTION.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/50 mt-0.5">
                <span>{formatPrice(SURFACE_PROTECTION.price)}/m² × {areaNum}</span>
                <span className="text-purple-400">{formatPrice(priceBreakdown.surfaceProtectionPrice)}</span>
              </div>
            </div>
          )}

          {/* 셀프레벨링 */}
          {includeSelfLeveling && priceBreakdown.selfLevelingPrice > 0 && (
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-400">+ 셀프레벨링</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/50 mt-0.5">
                <span>{formatPrice(priceBreakdown.selfLevelingPricePerM2)}/m² × {areaNum}</span>
                <span className="text-green-400">{formatPrice(priceBreakdown.selfLevelingPrice)}</span>
              </div>
            </div>
          )}

          {/* 조색비 */}
          {needsColorMixingFee && priceBreakdown.colorMixingFee > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-yellow-400">+ 조색비</span>
              <span className="text-yellow-400">{formatPrice(priceBreakdown.colorMixingFee)}</span>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="border-t border-white/10 pt-4">
          {/* 최소 출장비 안내 */}
          {priceBreakdown.isMinFeeApplied && (
            <div className="flex items-start gap-2 mb-3 p-2 bg-yellow-500/10 rounded-lg">
              <AlertCircle size={14} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-yellow-500 text-xs">최소 출장비 적용 (300,000원)</p>
            </div>
          )}

          {/* 합계 */}
          <div className="flex justify-between items-center">
            <span className="text-white/70">예상 견적</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">{formatPrice(priceBreakdown.total)}</span>
              <p className="text-xs text-white/40">부가세 별도</p>
            </div>
          </div>
        </div>

        {/* 제출 버튼 (데스크톱) */}
        {!isMobile && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full mt-6 flex items-center justify-center gap-2 h-12 bg-primary rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>요청 중...</span>
              </>
            ) : (
              <>
                <span>견적 요청하기</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
      {/* 왼쪽: 옵션 선택 영역 */}
      <div className="space-y-8 pb-32 lg:pb-8">
        {/* 1. 면적 입력 (상단으로 이동) */}
        <section className="space-y-3">
          <h3 className="text-white text-sm font-medium flex items-center gap-2">
            시공 면적
            <span className="text-xs text-primary bg-primary/20 px-2 py-0.5 rounded">필수</span>
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="면적 입력"
                className="flex-1 bg-transparent border border-white/20 rounded-lg px-4 py-3 text-white text-lg placeholder:text-white/40 focus:outline-none focus:border-primary"
              />
              <span className="text-white/70">m²</span>
            </div>
            {area && parseFloat(area) > 0 && (
              <span className="text-white/50 text-sm">≈ {sqmToPyeong(parseFloat(area))}평</span>
            )}
          </div>
        </section>

        {/* 2. 마감재 선택 */}
        <section className="space-y-4">
          <h3 className="text-white text-sm font-medium">마감재 종류</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* 3. 이미지 갤러리 (마감재 선택 시) */}
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
                className="flex gap-3 overflow-hidden px-10 py-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {currentGallery.map((image, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative shrink-0 w-[calc((100%-5rem-0.75rem)/2)] aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all",
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

        {/* 4. 광택 선택 (마감재에 따라 동적) */}
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

        {/* 5. 색상 선택 (마감재에 따라 동적) */}
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

        {/* 6. 바닥 상태 (칼라 에폭시 전용) */}
        {selectedMaterial && currentOptionsConfig?.showFloorCondition && (
          <section className="space-y-3">
            <h3 className="text-white text-sm font-medium">바닥 상태</h3>
            <div className="space-y-2">
              {(Object.entries(FLOOR_CONDITIONS) as [FloorConditionId, typeof FLOOR_CONDITIONS[FloorConditionId]][]).map(([id, condition]) => (
                <label
                  key={id}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                    floorCondition === id
                      ? "bg-primary/10 border-primary"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  )}
                >
                  <input
                    type="radio"
                    name="floorCondition"
                    checked={floorCondition === id}
                    onChange={() => setFloorCondition(id)}
                    className="mt-0.5 w-4 h-4 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <div className="flex-1">
                    <span className="text-white text-sm font-medium">{condition.name}</span>
                    <p className="text-white/60 text-xs mt-0.5">{condition.description}</p>
                    <p className="text-primary text-xs mt-1">→ {condition.method}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* 7. 셀프레벨링 (투명 에폭시: 기본 체크+권장, 콩자갈/우레탄: 선택, 칼라 에폭시: 숨김) */}
        {selectedMaterial && currentOptionsConfig?.selfLeveling !== "hidden" && (
          <section className="space-y-3">
            <label className={cn(
              "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
              currentOptionsConfig?.selfLeveling === "default_checked"
                ? "bg-primary/10 border-primary/50"
                : "bg-white/5 border-white/10 hover:border-white/20"
            )}>
              <input
                type="checkbox"
                checked={includeSelfLeveling}
                onChange={(e) => setIncludeSelfLeveling(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-white/30 bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{SELF_LEVELING.name}</span>
                  {currentOptionsConfig?.selfLeveling === "default_checked" ? (
                    <span className="text-xs text-primary px-2 py-0.5 bg-primary/20 rounded font-medium">권장</span>
                  ) : (
                    <span className="text-xs text-white/50 px-2 py-0.5 bg-white/10 rounded">선택</span>
                  )}
                </div>
                <p className="text-white/60 text-xs mt-1">{SELF_LEVELING.description}</p>
                {/* 권장 안내 문구 */}
                {currentOptionsConfig?.selfLevelingNote && (
                  <div className="flex items-start gap-1.5 mt-2 text-primary">
                    <AlertCircle size={12} className="shrink-0 mt-0.5" />
                    <p className="text-xs">{currentOptionsConfig.selfLevelingNote}</p>
                  </div>
                )}
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
        )}

        {/* 8. 추가 옵션 (미끄럼 방지, 표면 보호막) */}
        <section className="space-y-3">
          <h3 className="text-white text-sm font-medium">추가 옵션</h3>
          <div className="space-y-3">
            {/* 미끄럼 방지 처리 */}
            <label className={cn(
              "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
              includeAntiSlip
                ? "bg-blue-500/10 border-blue-500/50"
                : "bg-white/5 border-white/10 hover:border-white/20"
            )}>
              <input
                type="checkbox"
                checked={includeAntiSlip}
                onChange={(e) => setIncludeAntiSlip(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-white/30 bg-transparent text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div className="flex-1">
                <span className="text-white text-sm font-medium">{ANTI_SLIP.name}</span>
                <p className="text-white/60 text-xs mt-1">{ANTI_SLIP.description}</p>
                <p className="text-blue-400 text-xs mt-1">+{formatPrice(ANTI_SLIP.price)}/m²</p>
              </div>
            </label>

            {/* 표면 보호막 */}
            <label className={cn(
              "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
              includeSurfaceProtection
                ? "bg-purple-500/10 border-purple-500/50"
                : "bg-white/5 border-white/10 hover:border-white/20"
            )}>
              <input
                type="checkbox"
                checked={includeSurfaceProtection}
                onChange={(e) => setIncludeSurfaceProtection(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-white/30 bg-transparent text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
              />
              <div className="flex-1">
                <span className="text-white text-sm font-medium">{SURFACE_PROTECTION.name}</span>
                <p className="text-white/60 text-xs mt-1">{SURFACE_PROTECTION.description}</p>
                <p className="text-purple-400 text-xs mt-1">+{formatPrice(SURFACE_PROTECTION.price)}/m²</p>
              </div>
            </label>
          </div>
        </section>

        {/* 9. 고급 옵션 (접기/펼치기) */}
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">고급 옵션</span>
              <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded">선택사항</span>
            </div>
            {isAdvancedOpen ? <ChevronUp size={18} className="text-white/70" /> : <ChevronDown size={18} className="text-white/70" />}
          </button>

          {isAdvancedOpen && (
            <div className="space-y-4 p-4 rounded-lg border border-white/10 bg-white/5">
              {/* 바닥 상태 */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium block">현재 바닥 상태</label>
                <div className="space-y-2">
                  {(Object.entries(FLOOR_QUALITY) as [FloorQualityId, typeof FLOOR_QUALITY[FloorQualityId]][]).map(([id, quality]) => (
                    <label
                      key={id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all text-sm",
                        floorQuality === id
                          ? "bg-primary/10 border-primary"
                          : "bg-transparent border-white/10 hover:border-white/20"
                      )}
                    >
                      <input
                        type="radio"
                        name="floorQuality"
                        checked={floorQuality === id}
                        onChange={() => setFloorQuality(id)}
                        className="mt-0.5 w-4 h-4 text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <span className="text-white font-medium">{quality.name}</span>
                        <p className="text-white/60 text-xs mt-0.5">{quality.description}</p>
                        {quality.price > 0 && (
                          <p className="text-orange-400 text-xs mt-1">+{formatPrice(quality.price)}/m²</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 균열 상태 */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium block">바닥 균열 정도</label>
                <div className="space-y-2">
                  {(Object.entries(CRACK_CONDITION) as [CrackConditionId, typeof CRACK_CONDITION[CrackConditionId]][]).map(([id, condition]) => (
                    <label
                      key={id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all text-sm",
                        crackCondition === id
                          ? "bg-primary/10 border-primary"
                          : "bg-transparent border-white/10 hover:border-white/20"
                      )}
                    >
                      <input
                        type="radio"
                        name="crackCondition"
                        checked={crackCondition === id}
                        onChange={() => setCrackCondition(id)}
                        className="mt-0.5 w-4 h-4 text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <span className="text-white font-medium">{condition.name}</span>
                        <p className="text-white/60 text-xs mt-0.5">{condition.description}</p>
                        {condition.price > 0 && (
                          <p className="text-red-400 text-xs mt-1">+{formatPrice(condition.price)}/m²</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 10. 사진 첨부 */}
        <section className="space-y-3">
          <h3 className="text-white text-sm font-medium flex items-center gap-2">
            바닥 사진 첨부
            <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded">선택사항</span>
          </h3>
          <p className="text-white/50 text-xs">바닥 상태 사진을 첨부하시면 더 정확한 견적을 드릴 수 있습니다 (최대 3장)</p>

          {/* 사진 미리보기 */}
          {photoPreviewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {photoPreviewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                  <Image src={url} alt={`사진 ${index + 1}`} fill className="object-cover" sizes="150px" />
                  <button
                    type="button"
                    onClick={() => handlePhotoRemove(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 업로드 버튼 */}
          {photos.length < 3 && (
            <label className="flex items-center justify-center gap-2 w-full p-4 rounded-lg border-2 border-dashed border-white/20 hover:border-primary/50 cursor-pointer transition-colors bg-white/5">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={isCompressing}
              />
              {isCompressing ? (
                <>
                  <Loader2 size={18} className="text-primary animate-spin" />
                  <span className="text-white/70 text-sm">압축 중...</span>
                </>
              ) : (
                <>
                  <Upload size={18} className="text-primary" />
                  <span className="text-white/70 text-sm">사진 선택 ({photos.length}/3)</span>
                </>
              )}
            </label>
          )}
        </section>

        {/* 11. 연락처 정보 */}
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
            <input
              type="text"
              value={contactData.name}
              onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="담당자 이름"
              className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
            />
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

        {/* 9. 제출 버튼 (모바일용) */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="lg:hidden w-full flex items-center justify-center gap-2 h-14 bg-primary rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>요청 중...</span>
            </>
          ) : (
            <>
              <span>견적 요청하기</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* 오른쪽: 스티키 견적 패널 (데스크톱) */}
      <div className="hidden lg:block">
        <QuoteSummaryPanel className="sticky top-4" />
      </div>

      {/* 하단 고정 견적 바 (모바일) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* 펼쳐진 패널 */}
        {isMobilePanelOpen && (
          <div className="bg-black/95 backdrop-blur-lg border-t border-white/10 p-4 max-h-[60vh] overflow-y-auto">
            <QuoteSummaryPanel isMobile />
          </div>
        )}

        {/* 고정 바 */}
        <div className="bg-black/95 backdrop-blur-lg border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Calculator size={18} className="text-primary" />
              <span className="text-white/70 text-sm">예상 견적</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg">
                {priceBreakdown ? formatPrice(priceBreakdown.total) : "0원"}
              </span>
              <ChevronUp
                size={18}
                className={cn(
                  "text-white/50 transition-transform",
                  isMobilePanelOpen && "rotate-180"
                )}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
