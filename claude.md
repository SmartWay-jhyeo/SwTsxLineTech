# 시공얼마.com (구 라인테크 자동 견적 시스템)

## 기본 수칙
- **언어:** 모든 답변은 한국어로 제공합니다.

## 프로젝트 개요
**"시공 비용, 궁금할 땐 시공얼마"**
누구나 쉽고 빠르게 차선, 에폭시, 도장 시공 예상 견적을 확인할 수 있는 실용적인 웹 플랫폼입니다. 복잡한 절차 없이 지도 측정과 옵션 선택만으로 즉시 견적을 산출합니다.

## 기술 스택
- Next.js 15+ (App Router), React 19, TypeScript
- Supabase (PostgreSQL, Auth, Storage)
- Tailwind CSS + Shadcn/ui
- Kakao Maps API

## 서비스 유형

| 서비스 | URL | 주요 기능 |
|--------|-----|-----------|
| 차선 | `/quote/lane` | 지도 면적 측정 → 주차칸 자동 계산 |
| 에폭시 | `/quote/epoxy` | 재료/마감/색상 선택 |
| 도장 | `/quote/paint` | 재료/마감/색상 선택 |
| 포트폴리오 | `/portfolio` | 시공 사례 갤러리 및 카테고리별 조회 |
| 시공 후기 | `/reviews` | 고객 시공 후기 목록 |

## 관리자 기능 (Admin)
URL: `/admin` (로그인 필요)
- **대시보드**: 주요 지표 확인
- **견적 관리**: 접수된 차선/에폭시/도장 견적 목록 조회 및 상태 관리 (`QuotesTable`)
- **가격 관리**: 시공 단가 및 자재 가격 설정 (`PricingManager`)
- **포트폴리오 관리**: 시공 사례 등록 및 수정

## 핵심 비즈니스 로직

### 공통
**최소 출장비** - 견적 < 예를들어 300,000원이면 300,000원 반환

### 차선 (Lane)
- 면적 30m² = 주차 1대
- 장애인석: 10대 이상 시 3%
- 전기차석: 20대 이상 시 5%
- 단가: 일반 30,000원, 장애인/전기차 50,000원

### 에폭시/도장 (Epoxy/Paint)
**재료 옵션**
- 에폭시: 콘크리트 에폭시, 칼라 에폭시, 우레탄 방수, 셀프레벨링
- 도장: 내부 도장, 외부 도장, 방수 페인트, 내화 페인트

**마감**: 유광, 무광, 반광
**색상**: 파랑, 초록, 회색, 흰색, 노랑, 빨강, 검정

## 디렉토리 구조
```
src/
├── app/           # 페이지 (/(public), /admin)
├── features/      # 도메인 로직 (quote, portfolio, auth, admin)
├── components/    # 공용 UI (ui/, shared/)
├── lib/           # 유틸 (supabase, cn)
└── types/         # 타입 정의
```

## 명령어
```bash
npm run dev     # 개발 서버 (localhost:3000)
npm run build   # 프로덕션 빌드
npm run lint    # ESLint 검사
```

## 주요 파일

| 기능 | 파일 |
|------|------|
| 차선 견적 | `src/features/quote/components/LaneQuoteForm.tsx` |
| 에폭시/도장 견적 | `src/features/quote/components/QuoteForm.tsx` |
| 재료 선택 | `src/features/quote/components/MaterialSelector.tsx` |
| 마감 선택 | `src/features/quote/components/FinishTypeSelector.tsx` |
| 색상 선택 | `src/features/quote/components/ColorPicker.tsx` |
| 가격 계산 | `src/features/quote/utils/parkingCalculator.ts` |
| 인증 | `src/features/auth/actions.ts` |

## 문서
- 코딩 규칙: `docs/coding-conventions.md`
- 아키텍처: `docs/architecture.md`
- 트러블슈팅: `docs/troubleshooting.md`
