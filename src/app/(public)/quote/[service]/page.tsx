import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QuoteForm } from "@/features/quote/components/QuoteForm";
import { getPricingRules } from "@/features/quote/actions";

type ServiceType = "lane" | "epoxy" | "paint";

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
