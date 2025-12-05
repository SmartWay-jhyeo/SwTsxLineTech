# 견적 제출 기능 구현 TODO

## 현재 상태
- [x] 견적 폼 UI (Lane, Epoxy) 구현됨
- [x] 가격 계산 로직 구현됨
- [x] Supabase `quotes` 테이블 스키마 정의됨
- [x] 서버 액션 파일 생성됨 (`src/features/quote/actions.ts`)
- [ ] 폼 제출 → DB 저장 연동 (진행중)
- [ ] 관리자 견적 목록 페이지

## 남은 작업

### 1. LaneQuoteForm handleSubmit 수정
**파일**: `src/features/quote/components/LaneQuoteForm.tsx`

수정 내용:
1. import 추가:
```typescript
import { Loader2 } from "lucide-react";
import { submitQuote, type LaneQuoteInput } from "../actions";
```

2. 상태 추가:
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
```

3. handleSubmit을 async로 변경하고 서버 액션 호출

4. 버튼에 disabled, 로딩 상태 추가

### 2. EpoxyQuoteForm handleSubmit 수정
**파일**: `src/features/quote/components/EpoxyQuoteForm.tsx`

동일하게 서버 액션 연동

### 3. 관리자 견적 목록 페이지 생성
**파일**: `src/app/admin/quotes/page.tsx` (신규)

```typescript
import { getQuotes } from "@/features/quote/actions";
// quotes 테이블 조회 후 테이블 형태로 표시
```

### 4. 관리자 사이드바 메뉴 추가
**파일**: `src/app/admin/layout.tsx`

"견적 관리" 메뉴 추가 → `/admin/quotes`

## 생성된 파일

### src/features/quote/actions.ts
```typescript
"use server";
import { createClient } from "@/lib/supabase/server";

export async function submitQuote(data) { ... }
export async function getQuotes() { ... }
```

이 파일은 이미 생성됨!
