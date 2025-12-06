import { getPricingRules } from "@/features/quote/actions";
import { PricingManager } from "@/features/admin/components/PricingManager";

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const rules = await getPricingRules();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">단가 관리</h2>
        <p className="text-sm text-gray-500">
          견적 계산에 사용되는 기준 단가를 관리합니다. 수정 시 즉시 반영됩니다.
        </p>
      </div>

      <PricingManager initialRules={rules} />
    </div>
  );
}
