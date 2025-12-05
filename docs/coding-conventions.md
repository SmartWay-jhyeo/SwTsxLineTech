# 코딩 규칙

## TypeScript & 문법
- **STRICT 모드**: `any` 사용 금지, `// @ts-ignore` 사용 금지
- **함수형 컴포넌트**: `const Component = () => {}` 형태로 named export 사용
- **임포트**: 절대 경로 사용 (`@/components/...`), 상대 경로 금지

## Next.js App Router 규칙
- 모든 컴포넌트는 기본적으로 **서버 컴포넌트**
- 다음 경우에만 `'use client'` 추가:
  - `useState`, `useEffect`, `useRef` 사용 시
  - 이벤트 리스너 (`onClick`, `onChange`) 사용 시
  - 브라우저 API (`window`, `localStorage`) 사용 시
- 데이터 페칭은 **Server Actions** 사용 (`useEffect` 지양)

## UI & 스타일링
- **Tailwind**: 유틸리티 클래스 사용, CSS 파일 생성 금지
- **반응형**: 모바일 우선 (예: `w-full md:w-1/2`)
- **Shadcn UI**: `cn()` 유틸리티로 className 감싸기
  ```tsx
  // Good
  <Button className={cn("bg-red-500", className)} />

  // Bad
  <Button className="bg-red-500" />
  ```

## 상태 관리
- **폼**: `react-hook-form` 사용 (복잡한 폼에 `useState` 금지)
- **전역 상태**: `Zustand` 사용 (단계 간 데이터 유지)
