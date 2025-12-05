"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MaterialSelector } from "./MaterialSelector";
import { FinishTypeSelector } from "./FinishTypeSelector";
import { ColorPicker } from "./ColorPicker";
import { ContactForm } from "./ContactForm";
import { LaneQuoteForm } from "./LaneQuoteForm";
import { EpoxyQuoteForm } from "./EpoxyQuoteForm";

type ServiceType = "lane" | "epoxy" | "paint";
type FinishType = "glossy" | "matte" | "satin";

type QuoteFormProps = {
  serviceType: ServiceType;
};

// 서비스별 재료 옵션
const materialOptions: Record<ServiceType, { id: string; label: string; description?: string }[]> = {
  lane: [
    { id: "oil-paint", label: "유성 페인트", description: "일반적인 차선 도색용" },
    { id: "epoxy", label: "무용제 에폭시", description: "내구성이 뛰어남" },
    { id: "mma", label: "MMA 페인트", description: "빠른 건조" },
    { id: "polyurea", label: "폴리우레아 페인트", description: "최고급 내구성" },
  ],
  epoxy: [
    { id: "concrete-epoxy", label: "콘크리트 에폭시", description: "일반 바닥용" },
    { id: "color-epoxy", label: "칼라 에폭시", description: "다양한 색상 선택 가능" },
    { id: "urethane", label: "우레탄 방수", description: "방수 기능 포함" },
    { id: "self-leveling", label: "셀프레벨링", description: "평탄한 마감" },
  ],
  paint: [
    { id: "interior", label: "내부 도장", description: "실내 벽면용" },
    { id: "exterior", label: "외부 도장", description: "외벽 전용" },
    { id: "waterproof", label: "방수 페인트", description: "습기 방지" },
    { id: "fireproof", label: "내화 페인트", description: "화재 방지" },
  ],
};

// 색상 옵션
const colorOptions = [
  { id: "blue", name: "파랑", hex: "#3B82F6" },
  { id: "green", name: "초록", hex: "#22C55E" },
  { id: "yellow", name: "노랑", hex: "#FACC15" },
  { id: "orange", name: "주황", hex: "#F97316" },
  { id: "red", name: "빨강", hex: "#EF4444" },
  { id: "gray", name: "회색", hex: "#6B7280" },
  { id: "white", name: "흰색", hex: "#FFFFFF" },
];

// 서비스별 이미지
const serviceImages: Record<ServiceType, string> = {
  lane: "/images/bg-lane.jpg",
  epoxy: "/images/bg-epoxy.jpg",
  paint: "/images/bg-paint.jpg",
};

// 서비스별 이름
const serviceNames: Record<ServiceType, string> = {
  lane: "차선/주차선",
  epoxy: "바닥 에폭시/우레탄방수",
  paint: "내/외부 도장",
};

export function QuoteForm({ serviceType }: QuoteFormProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<FinishType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [contactData, setContactData] = useState({
    location: "",
    area: "",
    name: "",
  });

  const handleSubmit = () => {
    // TODO: 실제 견적 제출 로직
    alert("견적 요청이 제출되었습니다!");
  };

  // 차선/주차선은 전용 폼 사용
  if (serviceType === "lane") {
    return <LaneQuoteForm />;
  }

  // 에폭시/바닥 시공은 전용 폼 사용
  if (serviceType === "epoxy") {
    return <EpoxyQuoteForm />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Image Preview */}
      <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px] rounded-lg overflow-hidden">
        <Image
          src={serviceImages[serviceType]}
          alt={serviceNames[serviceType]}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {/* Badge */}
        <div className="absolute top-4 left-4 bg-primary px-3 py-1.5 rounded text-white text-xs font-medium">
          {serviceNames[serviceType]}
        </div>
      </div>

      {/* Right: Form */}
      <div className="space-y-6">
        {/* Material Selector */}
        <MaterialSelector
          title="마감재 종류"
          options={materialOptions[serviceType]}
          selectedId={selectedMaterial}
          onSelect={setSelectedMaterial}
        />

        {/* Finish Type Selector */}
        <FinishTypeSelector
          selectedType={selectedFinish}
          onSelect={setSelectedFinish}
        />

        {/* Color Picker */}
        <ColorPicker
          colors={colorOptions}
          selectedId={selectedColor}
          onSelect={setSelectedColor}
        />

        {/* Contact Form */}
        <ContactForm data={contactData} onChange={setContactData} />

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 h-14 bg-primary rounded-full text-white font-medium hover:opacity-90 transition-opacity"
        >
          <span>견적 요청하기</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
