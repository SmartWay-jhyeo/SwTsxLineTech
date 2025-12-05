# 트러블슈팅 가이드

이 프로젝트에서 발생했던 문제들과 해결책을 정리한 문서입니다.

---

## 1. Vercel 배포 오류: Page/Layout export

**문제**
```
Type error: 'ComponentName' is not a valid Page/Layout export field
```

**원인**: Next.js App Router의 `page.tsx`, `layout.tsx`는 `default export` 필수

**해결**
```tsx
// ❌ 오류
export function Page() { ... }
export { Page as default };

// ✅ 정상
export default function Page() { ... }
```

---

## 2. Next.js 15+ cookies() 비동기 변경

**문제**
```
Property 'getAll' does not exist on type 'Promise<ReadonlyRequestCookies>'
```

**원인**: Next.js 15부터 `cookies()` 함수가 비동기로 변경됨

**해결**
```typescript
// ❌ 이전 방식
const cookieStore = cookies();

// ✅ Next.js 15+ 방식
const cookieStore = await cookies();
```

---

## 3. 타입 충돌 (Category 등)

**문제**
```
Type 'Category' is not assignable to type 'Category'.
Two different types with this name exist, but they are unrelated.
```

**원인**: 여러 파일에서 같은 이름의 타입을 로컬로 재정의

**해결**: `types/index.ts`에서만 정의하고, 다른 파일에서는 import
```typescript
// types/index.ts
export type ServiceType = "lane" | "epoxy" | "paint";

// 다른 파일
import { ServiceType } from "@/types";
```

---

## 4. Route Group 경로 충돌

**문제**
```
You cannot have two parallel pages that resolve to the same path.
Please check /(admin) and /(public).
```

**원인**: `/(admin)/page.tsx`와 `/(public)/page.tsx` 모두 `/` 경로로 해석됨

**해결**: admin은 Route Group 대신 일반 폴더로 변경
```
src/app/
├── (public)/      # Route Group (괄호 유지)
│   └── page.tsx   # → /
└── admin/         # 일반 폴더 (괄호 제거)
    └── page.tsx   # → /admin
```

---

## 5. Supabase Storage 이미지 깨짐

**문제**: 이미지 업로드 성공했으나 웹페이지에서 깨져 보임

**원인**: Next.js `Image` 컴포넌트가 외부 도메인 차단

**해결**: `next.config.mjs`에 remotePatterns 추가
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ykcnmlddvyytwryrlima.supabase.co',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  }
};
```

---

## 6. npm install 의존성 충돌 (ERESOLVE)

**문제**
```
ERESOLVE could not resolve
eslint-config-next requires eslint@^9, but eslint@8 was found
```

**해결**: ESLint 버전 업그레이드
```bash
npm install eslint@^9
```

---

## 7. form action Server Action 타입 불일치

**문제**: `form action={deleteAction.bind(...)}` 사용 시 TypeScript 오류

**원인**: Server Action이 에러 객체를 반환할 수 있어 `void` 타입과 불일치

**해결**: 인라인 async 함수로 감싸기
```tsx
// ❌ 오류
<form action={deleteItem.bind(null, id)}>

// ✅ 정상
<form action={async () => {
  "use server";
  await deleteItem(id);
}}>
```

---

## 8. useEffect exhaustive-deps 경고

**문제**: `ParkingAreaMap.tsx`에서 useEffect 의존성 경고

**해결**: 초기화 로직의 특성상 안전하다고 판단되면 경고 무시
```typescript
useEffect(() => {
  // 초기화 로직
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

---

## 9. 텍스트 가시성 문제 (흰색 배경에 흰색 글자)

**문제**: 입력 필드의 글자가 보이지 않음

**해결**: 입력 필드에 `text-gray-900` 클래스 추가
```tsx
<input className="text-gray-900 ..." />
```

---

## 10. Vercel 빌드 환경 ENOENT 오류

**문제**
```
ENOENT: no such file or directory, lstat '.next/server/app/...'
```

**원인**: Next.js 특정 버전과 Vercel 빌드 환경 간 호환성 문제

**해결**: 의존성 최신 버전으로 업데이트
```bash
npm install next@latest react@latest react-dom@latest
```

---

## 11. git add 실패 (nul 파일)

**문제**: Windows에서 `nul` 파일로 인해 `git add .` 실패

**해결**: `nul` 파일 삭제
```bash
rm nul
```

---

## 참조
- 전체 작업 로그: `ai_log/summary.md`

---

## 12. Vercel 배포 후 새 이미지만 깨짐 (git 추적 누락)

**문제**: 로컬에서는 이미지가 보이는데 Vercel 배포 후 새로 추가한 이미지만 깨짐

**원인**: 새 이미지 파일이 `git add`되지 않아서 GitHub에 push되지 않음

**진단**
```bash
git status public/images/
# Untracked files:
#   public/images/manual-region2.gif  ← git에 추가 안 됨!
```

**해결**
```bash
git add public/images/새파일.gif
git commit -m "Add missing image"
git push
```

---

## 13. Next.js Image + 쿼리스트링 충돌

**문제**: 캐시 버스팅용 `?v=2` 쿼리스트링 추가 후 모든 이미지 깨짐

**원인**: Next.js `Image` 컴포넌트가 로컬 이미지 경로에 쿼리스트링을 처리하지 못함

**해결**: 쿼리스트링 제거
```typescript
// ❌ 오류 - Next.js Image와 호환 안 됨
const IMG_VERSION = "?v=2";
thumbnail: `/images/epoxy/image.jpg${IMG_VERSION}`

// ✅ 정상 - 쿼리스트링 제거
const IMG_VERSION = "";
thumbnail: `/images/epoxy/image.jpg`
```

**대안**: 캐시 버스팅이 필요하면 파일명 자체를 변경 (예: `image-v2.jpg`)
