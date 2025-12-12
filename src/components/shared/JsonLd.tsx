export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "시공얼마",
    alternateName: "스마트로드",
    url: "https://시공얼마.com",
    logo: "https://시공얼마.com/images/logo3.png",
    image: "https://시공얼마.com/images/logo3.png",
    description:
      "주차장 차선도색, 바닥 에폭시, 우레탄방수, 도장공사 전문. 1분만에 무료 견적 받아보세요. 시공얼마 공식 견적 시스템.",
    telephone: "010-4806-9911",
    email: "smartroad.jhyeo@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "은봉로297 305호",
      addressLocality: "남동구",
      addressRegion: "인천광역시",
      postalCode: "21634", // Approximate for Incheon Namdong-gu
      addressCountry: "KR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "37.40", // Approximate for Incheon Namdong-gu
      longitude: "126.70", // Approximate for Incheon Namdong-gu
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
