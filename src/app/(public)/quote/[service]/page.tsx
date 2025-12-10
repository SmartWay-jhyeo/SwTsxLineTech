import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QuoteForm } from "@/features/quote/components/QuoteForm";
import { getPricingRules } from "@/features/quote/actions";
import { Metadata } from "next";

type ServiceType = "lane" | "epoxy" | "paint";

const serviceMeta: Record<string, { title: string; description: string; keywords: string[] }> = {
  lane: {
    title: "차선 도색 견적",
    description: "주차장 차선, 주차선 도색 견적을 1분만에 무료로 받아보세요. 장애인석, 전기차 충전구역 포함.",
    keywords: [
      "차선도색", "주차선도색", "주차장라인", "주차선그리기", "주차라인시공", 
      "주차장도색", "주차장도색견적", "카스토퍼설치", "장애인주차구역", "전기차주차구역"
    ],
  },
  epoxy: {
    title: "에폭시 시공 견적",
    description: "바닥 에폭시, 우레탄 방수, 셀프레벨링 시공 견적. 재료와 마감 선택 후 즉시 견적 확인.",
    keywords: [
      "에폭시시공", "바닥에폭시", "에폭시라이닝", "에폭시코팅", "빈티지바닥", 
      "우레탄방수", "옥상방수", "방수공사", "공장바닥에폭시", "창고바닥에폭시", "에폭시견적"
    ],
  },
  paint: {
    title: "도장 공사 견적",
    description: "내부 도장, 외부 도장, 방수 페인트 시공 견적. 색상과 마감 선택 후 무료 견적.",
    keywords: [
      "도장공사", "페인트시공", "내부도색", "외벽도색", "인테리어도장", 
      "상가페인트", "사무실페인트", "방수페인트", "페인트견적", "도장견적"
    ],
  },
};

type MetadataProps = {
  params: Promise<{ service: string }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { service } = await params;
  const meta = serviceMeta[service] || serviceMeta.lane;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: `${meta.title} | 시공얼마`,
      description: meta.description,
    },
  };
}

type QuotePageProps = {
  params: Promise<{
    service: string;
  }>;
};

const serviceNames: Record<string, string> = {
  lane: "차선/주차선",
  epoxy: "바닥 에폭시/우레탄방수",
  paint: "내/외부 도장",
};

const serviceDescriptions: Record<string, string> = {
  lane: "원하는 옵션을 선택하고, 시공 정보를 입력하면 간편하게 견적을 받아볼 수 있습니다",
  epoxy: "바닥재 종류와 마감 옵션을 선택해 최적의 견적을 받아보세요",
  paint: "도장 종류와 색상을 선택하고 견적을 받아보세요",
};

export default async function Page({ params }: QuotePageProps) {
  const { service } = await params;
  const serviceName = serviceNames[service] || "서비스";
  const serviceDescription = serviceDescriptions[service] || "견적을 받아보세요";
  
  // Fetch dynamic pricing rules
  const pricingRules = await getPricingRules();

  // 유효한 서비스 타입인지 확인
  const validServices: ServiceType[] = ["lane", "epoxy", "paint"];
  const serviceType = validServices.includes(service as ServiceType)
    ? (service as ServiceType)
    : "lane";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Back Button */}
      <div className="pt-6 px-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>돌아가기</span>
        </Link>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-4">{serviceName} 견적 계산하기</h1>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          {serviceDescription}
        </p>

        {/* Quote Form */}
        <div className="max-w-4xl mx-auto">
          <QuoteForm serviceType={serviceType} pricingRules={pricingRules} />
        </div>
      </div>
    </div>
  );
}
