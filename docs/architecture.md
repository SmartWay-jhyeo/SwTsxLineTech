# 아키텍처 상세

## 디렉토리 구조 (Feature-based)

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (Noto Sans KR, Kakao Maps SDK)
│   ├── (public)/                 # 공개 페이지 그룹
│   │   ├── page.tsx              # 홈 (서비스 선택)
│   │   ├── quote/[service]/      # 동적 견적 페이지 (lane/epoxy/paint)
│   │   └── portfolio/            # 시공 실적 갤러리
│   └── (admin)/                  # 관리자 페이지 그룹 (인증 필요)
│       ├── login/                # 로그인
│       ├── page.tsx              # 대시보드
│       └── portfolio/new/        # 새 시공 사례 등록
│
├── features/                     # 도메인별 기능
│   ├── quote/                    # 견적 계산
│   │   ├── components/           # LaneQuoteForm, ParkingAreaMap 등
│   │   └── utils/                # parkingCalculator.ts
│   ├── portfolio/                # 시공 사례
│   │   └── components/           # CategoryFilter, ProjectCard
│   ├── auth/                     # 인증
│   │   └── actions.ts            # 로그인/로그아웃 Server Actions
│   └── admin/                    # 관리자
│       └── actions.ts            # 포트폴리오 삭제 등
│
├── components/
│   ├── ui/                       # Shadcn 기본 컴포넌트
│   └── shared/                   # Header, ServicePanel 등
│
├── lib/
│   ├── utils.ts                  # cn() 헬퍼
│   └── supabase/                 # client.ts, server.ts
│
└── types/
    ├── index.ts                  # ServiceType, QuoteFormData 등
    └── kakao.d.ts                # Kakao Maps 타입
```

## 데이터 타입

```typescript
// 서비스 종류
type ServiceType = "lane" | "epoxy" | "paint";

// 견적 입력
type QuoteFormData = {
  serviceType: ServiceType;
  area: number;                    // m²
  surfaceCondition: "good" | "normal" | "bad";
  options: string[];
  contactName: string;
  contactPhone: string;
};

// 주차 계산 결과
type ParkingCalculationResult = {
  totalSpots: number;
  regularSpots: number;
  disabledSpots: number;
  evSpots: number;
};
```

## 인증 흐름

```
/admin/* 접근
    ↓
middleware.ts 검사
    ↓
├── 미인증 → /admin/login 리다이렉트
└── 인증됨 → 페이지 접근 허용
```

## 견적 계산 흐름

```
1. 지도에서 영역 그리기 (Kakao Maps)
    ↓
2. 면적 자동 계산 (Shoelace 알고리즘)
    ↓
3. 주차 구획 자동 계산
   - 총 대수 = 면적 ÷ 30
   - 장애인석 = 3% (10대 이상 시)
   - 전기차석 = 5% (20대 이상 시)
    ↓
4. 가격 계산
   - 일반: 30,000원/대
   - 장애인/전기차: 50,000원/대
    ↓
5. 최소 출장비 적용 (300,000원)
```

## 외부 API

| API | 용도 |
|-----|------|
| Supabase | DB, 인증, 스토리지 |
| Kakao Maps | 지도, 면적 측정 |
