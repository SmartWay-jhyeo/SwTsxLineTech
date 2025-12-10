import { Metadata } from "next";

export const metadata: Metadata = {
  title: "고객 후기",
  description: "라인테크 시공 고객 후기 및 평점. 차선도색, 에폭시, 도장 시공 실제 이용 고객들의 생생한 리뷰.",
  keywords: ["고객 후기", "시공 리뷰", "차선 도색 후기", "에폭시 시공 후기", "도장 후기"],
  openGraph: {
    title: "고객 후기 | 시공얼마",
    description: "라인테크 시공 고객 후기 및 평점",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
