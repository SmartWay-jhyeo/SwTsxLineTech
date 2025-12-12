import Image from "next/image";
import { QuickQuoteCalculator } from "./QuickQuoteCalculator";
import { getPricingRulesQuery } from "@/features/quote/queries";

export async function HeroSection() {
  const pricingRules = await getPricingRulesQuery();

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image Slider (Static for now, can be slider later) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/epoxy/gravel_beige.jpg"
          alt="Background"
          fill
          className="object-cover opacity-80" // 밝은 이미지라 투명도 높임
          priority
        />
        {/* 오버레이를 좀 더 진하게 해서 흰 글씨 확보 */}
        <div className="absolute inset-0 bg-black/60" /> 
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center pt-20 pb-10">
        {/* Left Content */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="mb-4">
            <span className="text-primary font-bold text-sm tracking-wide">3초 만에 확인하는 투명한 견적</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight" style={{ lineHeight: '1.3' }}>
            우리 건물 바닥과 페인트,<br />
            <span className="text-primary">호구 잡히지 않는 가격</span>은<br />
            얼마일까?
          </h1>
          
          <p className="text-lg text-white/80 max-w-xl mx-auto lg:mx-0 font-medium">
            상가, 빌라, 공장까지. 주먹구구식 견적은 이제 그만.<br className="hidden md:block" />
            시공얼마의 데이터 기반 정찰제로 3초 만에 확인하세요.
          </p>

          <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
            <div>
              <p className="text-3xl font-bold text-white">150+</p>
              <p className="text-sm text-white/50">누적 시공 견적</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-white/50">고객 만족도</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">14년</p>
              <p className="text-sm text-white/50">현장 경력</p>
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
