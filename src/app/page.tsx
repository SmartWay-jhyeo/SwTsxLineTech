import { Header } from "@/components/shared/Header";
import { Chatbot } from "@/components/shared/Chatbot";
import { YouTubeButton } from "@/components/shared/YouTubeButton";
import { HeroSection } from "@/features/landing/components/HeroSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* 1. Hero & Calculator Section */}
        <HeroSection />

        {/* 2. Trust/Social Proof Section */}
        <section className="py-20 bg-neutral-900 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                왜 <span className="text-primary">시공얼마</span>인가요?
              </h2>
              <p className="text-white/60">투명한 가격 정찰제와 검증된 시공 품질을 약속합니다.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<span className="text-4xl">💰</span>}
                title="투명한 정찰제"
                description="현장에서 말바꾸는 추가금 요구는 없습니다. 3초 견적 그대로, 합리적인 시공을 약속합니다."
              />
              <FeatureCard 
                icon={<span className="text-4xl">⚡</span>}
                title="빠른 시공 매칭"
                description="경기권 직영팀과 전국 네트워크를 통해 원하시는 일정에 맞춰 가장 빠른 시공팀을 배정합니다."
              />
              <FeatureCard 
                icon={<span className="text-4xl">🛡️</span>}
                title="확실한 A/S"
                description="시공 후 나몰라라 하는 업체에 지치셨나요? 시공얼마는 1년 하자 보수를 보증합니다."
              />
            </div>
          </div>
        </section>

        {/* 3. Portfolio Preview */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">최신 시공 사례</h2>
                <p className="text-white/60">시공얼마가 직접 시공한 현장을 확인해보세요.</p>
              </div>
              <Link 
                href="/portfolio" 
                className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                전체보기 <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <PortfolioCard 
                              image="/images/epoxy/color_gray_gloss.jpg"
                              title="인천 송도동 오피스텔 주차장 바닥"
                              category="에폭시"
                              price="평당 35,000원~"
                            />             <PortfolioCard 
               image="/images/bg-lane.jpg"
               title="화성시 공장 주차선"
               category="차선도색"
               price="최소 30만원~"
             />
                            <PortfolioCard 
                              image="/images/in_out_paint/outpaint.jpg"
                              title="전주 주택 외벽 페인트"
                              category="페인트"
                              price="방문 견적"
                            />               <PortfolioCard 
                 image="/images/epoxy/self_leveling.jpg"
                 title="동탄 카페 셀프 레벨링"
                 category="에폭시"
                 price="평당 60,000원~"
               />
            </div>

            <div className="mt-8 md:hidden flex justify-center">
              <Link 
                href="/portfolio" 
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                전체보기 <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Chatbot />
      <YouTubeButton />
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/60 leading-relaxed">{description}</p>
    </div>
  );
}

function PortfolioCard({ image, title, category, price }: { image: string; title: string; category: string; price: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium">
          {category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold mb-1 truncate">{title}</h3>
        <p className="text-primary text-sm font-medium">{price}</p>
      </div>
    </div>
  );
}