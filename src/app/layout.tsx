import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/shared/Footer";
import { JsonLd } from "@/components/shared/JsonLd";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://시공얼마.com"),
  title: {
    default: "시공얼마 | 차선도색 & 바닥도장 견적",
    template: "%s | 시공얼마",
  },
  description:
    "주차장 차선도색, 바닥 에폭시, 우레탄방수, 도장공사 전문. 1분만에 무료 견적 받아보세요. 시공얼마 공식 견적 시스템.",
  keywords: [
    // 차선/주차선
    "차선도색",
    "주차장도색",
    "주차선도색",
    "주차라인시공",
    "주차선그리기",
    "주차장라인",
    "카스토퍼",
    
    // 에폭시/방수
    "에폭시시공",
    "에폭시바닥",
    "바닥도장",
    "에폭시라이닝",
    "에폭시코팅",
    "우레탄방수",
    "옥상방수",
    "방수공사",
    "공장바닥",
    "창고바닥",
    "상가에폭시",
    
    // 도장/페인트
    "도장공사",
    "페인트시공",
    "외벽도색",
    "내부도색",
    "인테리어도장",
    "상가페인트",
    
    // 견적/비용
    "시공견적",
    "무료견적",
    "주차장도색견적",
    "에폭시견적",
    "페인트견적",
    "바닥공사비용",
  ],
  authors: [{ name: "스마트로드" }],
  creator: "스마트로드",
  publisher: "스마트로드",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://시공얼마.com",
    siteName: "시공얼마",
    title: "시공얼마 | 차선도색 & 바닥도장 무료 견적",
    description:
      "주차장 차선도색, 바닥 에폭시, 우레탄방수, 도장공사 전문. 1분만에 무료 견적!",
    images: [
      {
        url: "/images/logo3.png",
        width: 800,
        height: 600,
        alt: "시공얼마 로고",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    other: {
      "naver-site-verification": "c08e0b1763ee8135a20e30d14d0d5feeb780184b",
    },
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services,drawing&autoload=false`}
          strategy="afterInteractive"
        />
      </head>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <JsonLd />
        {children}
        <Footer />
      </body>
    </html>
  );
}
