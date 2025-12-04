import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "라인테크 | 차선도색 & 바닥도장 전문",
  description: "차선/주차선, 바닥 에폭시, 우레탄방수, 내/외부 도장 전문 시공업체",
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
      </body>
    </html>
  );
}
