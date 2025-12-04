"use client";

import { useState, useEffect, ReactNode } from "react";
import { X, ChevronRight, ChevronLeft, Search, MapPin, Calculator, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const TOUR_STORAGE_KEY = "quote-tour-completed";

type TourStep = {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
};

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "주소 검색하기",
    description: "먼저 시공할 위치의 주소를 검색해주세요. 정확한 위치를 찾아드립니다.",
    icon: <Search size={28} />,
  },
  {
    id: 2,
    title: "지도에서 영역 그리기",
    description: "주차장 영역의 꼭지점을 클릭하여 면적을 측정해주세요. 클릭할 때마다 점이 추가됩니다.",
    icon: <MapPin size={28} />,
  },
  {
    id: 3,
    title: "주차칸 확인 후 견적 요청",
    description: "자동 계산된 주차칸을 확인하고, 필요시 +/- 버튼으로 수정 후 견적을 요청하세요.",
    icon: <Calculator size={28} />,
  },
];

type TourGuideProps = {
  onComplete?: () => void;
};

export function TourGuide({ onComplete }: TourGuideProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // localStorage에서 투어 완료 여부 확인
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted) {
      // 살짝 딜레이 후 표시 (페이지 로드 후)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    if (dontShowAgain) {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    }
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm" />

      {/* Tour Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="relative bg-background border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            aria-label="닫기"
          >
            <X size={20} />
          </button>

          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  index === currentStep
                    ? "bg-primary w-6"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-white/30"
                )}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary animate-pulse">
              {step.icon}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-4">
            <p className="text-primary text-sm font-medium mb-1">
              STEP {step.id}
            </p>
            <h3 className="text-white text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
          </div>

          {/* Arrow animation pointing down */}
          <div className="flex justify-center mb-4">
            <div className="animate-bounce text-primary">
              <ChevronDown size={32} />
            </div>
          </div>

          {/* Don't show again checkbox */}
          <label className="flex items-center justify-center gap-2 mb-5 cursor-pointer group">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-transparent text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
              다시 보지 않기
            </span>
          </label>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex-1 flex items-center justify-center gap-2 h-12 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={18} />
                이전
              </button>
            )}
            <button
              onClick={handleNext}
              className={cn(
                "flex items-center justify-center gap-2 h-12 bg-primary rounded-lg text-white font-medium hover:opacity-90 transition-opacity",
                currentStep === 0 ? "w-full" : "flex-1"
              )}
            >
              {currentStep < tourSteps.length - 1 ? (
                <>
                  다음
                  <ChevronRight size={18} />
                </>
              ) : (
                "시작하기"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
