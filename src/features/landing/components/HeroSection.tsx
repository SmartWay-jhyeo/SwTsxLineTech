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
          src="/images/bg-epoxy.jpg"
          alt="Background"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center pt-20 pb-10">
        {/* Left Content */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="mb-4">
            <span className="text-primary font-bold text-sm tracking-wide">3초 만에 확인하는 투명한 견적</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight" style={{ lineHeight: '1.2' }}>
            건물 바닥·도색 시공<br />
            <span className="text-primary">부르는 게 값</span>이라<br />
            불안하셨나요?
          </h1>
          
          <p className="text-lg text-white/70 max-w-xl mx-auto lg:mx-0">
            주먹구구식 견적은 이제 그만. 시공얼마의 데이터 기반 자동 견적 시스템으로
            3초 만에 우리 건물 시공비를 투명하게 확인하세요.
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
