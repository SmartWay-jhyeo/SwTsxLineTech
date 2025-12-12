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
  metadataBase: new URL("https://linetech-landing.vercel.app"),
  title: {
    template: "%s | 시공얼마",
    default: "시공얼마 | 주차장 도색 & 바닥 에폭시 견적",
  },
  description:
    "주차장 도색, 바닥 에폭시, 우레탄방수, 도장공사 전문. 1분만에 무료 견적 받아보세요. 시공얼마 공식 견적 시스템.",
  keywords: [
    // 주차장 도색
    "주차장도색",
    "주차선도색",
    "주차선그리기",
    "카스토퍼",
    "주차장라인",
    // 에폭시
    "바닥에폭시",
    "에폭시코팅",
    "공장바닥",
    "주차장에폭시",
    // 도장
    "페인트시공",
    "외벽방수",
    "옥상방수",
    // 지역
    "서울",
    "경기",
    "인천",
  ],
  authors: [{ name: "시공얼마" }],
  creator: "시공얼마",
  publisher: "시공얼마",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://linetech-landing.vercel.app",
    siteName: "시공얼마",
    title: "시공얼마 | 주차장 도색 & 바닥 에폭시 무료 견적",
    description:
      "주차장 도색, 바닥 에폭시, 우레탄방수, 도장공사 전문. 1분만에 무료 견적!",
    images: [
      {
        url: "/images/bg-epoxy.jpg",
        width: 1200,
        height: 630,
        alt: "시공얼마 대표 이미지",
      },
    ],
  },
}

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
