import { getQuotes, updateQuoteStatus, type QuoteStatus } from "@/features/quote/actions";
import { QuotesTable } from "./QuotesTable";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const { data: quotes, success, error } = await getQuotes();

  if (!success) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">견적 관리</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          데이터를 불러오는 중 오류가 발생했습니다: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">견적 관리</h1>
        <span className="text-sm text-gray-500">총 {quotes?.length || 0}건</span>
      </div>

      {quotes && quotes.length > 0 ? (
        <QuotesTable quotes={quotes} />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          아직 접수된 견적이 없습니다.
        </div>
      )}
    </div>
  );
}
