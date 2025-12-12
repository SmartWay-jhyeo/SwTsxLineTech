import { createClient } from "@/lib/supabase/server";
import type { PricingRule } from "./actions";

/**
 * Fetch all pricing rules (Server-side query)
 * This function is safe to call directly in Server Components.
 */
export async function getPricingRulesQuery(): Promise<PricingRule[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pricing_rules")
      .select("*")
      .order("service_type", { ascending: true })
      .order("category", { ascending: true });

    if (error) {
      console.error("Error fetching pricing rules:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Exception fetching pricing rules:", error);
    return [];
  }
}
