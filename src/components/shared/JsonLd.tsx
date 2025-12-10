export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "라인테크",
    alternateName: "시공얼마",
    url: "https://시공얼마.com",
    logo: "https://시공얼마.com/images/logo.png",
    image: "https://시공얼마.com/images/logo.png",
    description:
      "주차장 차선도색, 바닥 에폭시, 우레탄방수, 도장공사 전문. 1분만에 무료 견적 받아보세요. 라인테크 공식 견적 시스템.",
    telephone: "031-575-1012",
    email: "linetech2012@naver.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "별내중앙로26, 506호",
      addressLocality: "남양주시",
      addressRegion: "경기도",
      postalCode: "12114", // Approximate, can be updated if known exactly
      addressCountry: "KR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "37.644", // Approximate for Byeollae-dong
      longitude: "127.128", // Approximate for Byeollae-dong
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "KRW",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
