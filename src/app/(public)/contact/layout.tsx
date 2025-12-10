import { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기",
  description: "차선도색, 에폭시, 도장 시공 문의. 전화, 이메일, 온라인 폼으로 편하게 문의하세요. 전국 출장 가능.",
  keywords: ["시공 문의", "견적 문의", "차선 시공 문의", "에폭시 문의", "도장 문의"],
  openGraph: {
    title: "문의하기 | 시공얼마",
    description: "차선도색, 에폭시, 도장 시공 문의",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
