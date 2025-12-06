import type { PricingRule } from "@/features/quote/actions";

export type PaintType = "interior" | "exterior";

export type PaintQuoteInput = {
  type: PaintType;
  area: number;
  isWaterproof: boolean;
  isFireproof: boolean;
  isPutty: boolean;
  pricingRules?: PricingRule[];
};

export type PaintPriceBreakdown = {
  basePricePerM2: number;
  basePrice: number;
  waterproofPrice: number;
  fireproofPrice: number;
  puttyPrice: number;
  total: number;
};

export function calculatePaintPrice(input: PaintQuoteInput): PaintPriceBreakdown {
  const { type, area, isWaterproof, isFireproof, isPutty, pricingRules } = input;

  const getPrice = (key: string, fallback: number) => {
    if (!pricingRules) return fallback;
    const rule = pricingRules.find(r => r.service_type === 'paint' && (r.category === 'area_base' || r.category === 'option') && r.key === key);
    return rule ? Number(rule.value) : fallback;
  };

  const basePricePerM2 = type === 'interior' 
    ? getPrice('interior', 25000) 
    : getPrice('exterior', 35000);

  const waterproofUnit = getPrice('waterproof', 10000);
  const fireproofUnit = getPrice('fireproof', 15000);
  const puttyUnit = getPrice('putty', 5000);

  const basePrice = basePricePerM2 * area;
  const waterproofPrice = isWaterproof ? waterproofUnit * area : 0;
  const fireproofPrice = isFireproof ? fireproofUnit * area : 0;
  const puttyPrice = isPutty ? puttyUnit * area : 0;

  const total = basePrice + waterproofPrice + fireproofPrice + puttyPrice;

  return {
    basePricePerM2,
    basePrice,
    waterproofPrice,
    fireproofPrice,
    puttyPrice,
    total
  };
}

export function formatPrice(price: number): string {
  return `${Math.round(price).toLocaleString()}원`;
}
