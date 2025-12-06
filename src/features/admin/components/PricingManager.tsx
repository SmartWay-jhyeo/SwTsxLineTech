"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { type PricingRule, updatePricingRule } from "@/features/quote/actions";
import { Button } from "@/components/ui/button";

type PricingManagerProps = {
  initialRules: PricingRule[];
};

const serviceLabels: Record<string, string> = {
  epoxy: "바닥 에폭시",
  lane: "차선/주차선",
  paint: "내/외부 도장",
  common: "공통",
};

const categoryLabels: Record<string, string> = {
  area_base: "기본 단가 (면적별)",
  option: "추가 옵션",
  tier: "구간 정액",
  material: "자재비",
};

export function PricingManager({ initialRules }: PricingManagerProps) {
  const router = useRouter();
  const [rules, setRules] = useState<PricingRule[]>(initialRules);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Group by Service Type
  const groupedRules = rules.reduce((acc, rule) => {
    const service = rule.service_type;
    if (!acc[service]) acc[service] = [];
    acc[service].push(rule);
    return acc;
  }, {} as Record<string, PricingRule[]>);

  const handleEditStart = (rule: PricingRule) => {
    setEditingId(rule.id);
    setEditValue(rule.value.toString());
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleSave = async (id: string) => {
    const newValue = parseFloat(editValue);
    if (isNaN(newValue)) {
      alert("유효한 숫자를 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updatePricingRule(id, newValue);
      if (result.success) {
        setRules(prev => prev.map(r => r.id === id ? { ...r, value: newValue } : r));
        setEditingId(null);
        router.refresh(); // 서버 데이터 갱신
      } else {
        alert("저장에 실패했습니다: " + result.error);
      }
    } catch (error) {
      alert("오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedRules).map(([service, serviceRules]) => (
        <div key={service} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-bold text-lg text-gray-900">
              {serviceLabels[service] || service}
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {/* Group by Category within Service */}
            {Object.entries(
              serviceRules.reduce((acc, rule) => {
                const cat = rule.category;
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(rule);
                return acc;
              }, {} as Record<string, PricingRule[]>)
            ).map(([category, categoryRules]) => (
              <div key={category} className="p-6">
                <h4 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
                  {categoryLabels[category] || category}
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryRules.map((rule) => (
                    <div key={rule.id} className="flex flex-col p-4 rounded-lg border border-gray-200 bg-white hover:border-primary/50 transition-colors">
                      <div className="mb-2">
                        <span className="font-medium text-gray-900">{rule.name}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{rule.description}</p>
                      </div>
                      
                      <div className="mt-auto pt-2 flex items-center justify-between gap-3">
                        {editingId === rule.id ? (
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 h-9 px-2 text-sm border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSave(rule.id)}
                              disabled={isSaving}
                              className="p-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                            >
                              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            </button>
                            <button
                              onClick={handleCancel}
                              disabled={isSaving}
                              className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                            >
                              <RefreshCw size={16} className="rotate-45" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold text-primary">
                                {rule.value.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {rule.unit === 'fixed' ? '원' : `원/${rule.unit || ''}`}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStart(rule)}
                              className="h-8 px-2 text-gray-400 hover:text-primary"
                            >
                              수정
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
