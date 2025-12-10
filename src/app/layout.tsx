import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/shared/Footer";
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
    "주차장 차선도색, 바닥 에폭시, 우레탄방수, 도장공사 전문. 1분만에 무료 견적 받아보세요. 라인테크 공식 견적 시스템.",
  keywords: [
    "차선도색",
    "주차장 라인",
    "에폭시 시공",
    "바닥 도장",
    "우레탄 방수",
    "주차장 시공",
    "바닥 코팅",
    "공장 바닥",
    "창고 바닥",
    "시공 견적",
  ],
  authors: [{ name: "라인테크" }],
  creator: "라인테크",
  publisher: "라인테크",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://시공얼마.com",
    siteName: "시공얼마",
    title: "시공얼마 | 차선도색 & 바닥도장 무료 견적",
    description:
      "주차장 차선도색, 바닥 에폭시, 우레탄방수, 도장공사 전문. 1분만에 무료 견적!",
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
        {children}
        <Footer />
      </body>
    </html>
  );
}
