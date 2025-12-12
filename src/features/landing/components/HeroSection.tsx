"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { QuickQuoteCalculator } from "./QuickQuoteCalculator";
import type { PricingRule } from "@/features/quote/actions";

const BACKGROUND_IMAGES = [
  "/images/epoxy/gravel_beige.jpg", // 1. 밝고 따뜻한 콩자갈 (메인)
  "/images/bg-epoxy.jpg",           // 2. 전문적인 에폭시
  "/images/bg-lane.jpg",            // 3. 깔끔한 주차장
];

export function HeroSection({ pricingRules }: { pricingRules: PricingRule[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 3000); // 3초마다 변경

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {BACKGROUND_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt="Background"
              fill
              className="object-cover opacity-80"
              priority={index === 0}
            />
          </div>
        ))}
        
        {/* 오버레이: 모바일은 더 진하게(90%), PC는 은은하게(60%) */}
        <div className="absolute inset-0 bg-black/90 md:bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-4 grid lg:grid-cols-2 gap-12 items-center pt-20 pb-10">
        {/* Left Content */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="mb-4">
            <span className="text-primary font-bold text-sm tracking-wide drop-shadow-md">3초 만에 확인하는 투명한 견적</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-snug md:leading-tight break-keep drop-shadow-xl">
            우리 건물 바닥과 페인트,<br />
            <span className="text-primary">호구 잡히지 않는 가격</span>은<br />
            얼마일까?
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 font-medium break-keep drop-shadow-md">
            상가, 빌라, 공장까지. 주먹구구식 견적은 이제 그만.<br className="hidden md:block" />
            시공얼마의 데이터 기반 정찰제로 3초 만에 확인하세요.
          </p>

          <div className="flex flex-wrap gap-4 md:gap-8 justify-center lg:justify-start pt-4">
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-bold text-white">150+</p>
              <p className="text-xs md:text-sm text-white/50">누적 시공 견적</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-bold text-white">98%</p>
              <p className="text-xs md:text-sm text-white/50">고객 만족도</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-bold text-white">14년</p>
              <p className="text-xs md:text-sm text-white/50">현장 경력</p>
            </div>
          </div>
        </div>

        {/* Right Content - Calculator Widget */}
        <div className="flex justify-center lg:justify-end">
          <QuickQuoteCalculator pricingRules={pricingRules} />
        </div>
      </div>
    </section>
  );
}