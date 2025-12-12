# Gemini's Failure Analysis & Learning Log

## 0. General Instructions
- **Language:** Always answer in Korean (한국어) unless explicitly requested otherwise.

## 1. Next.js App Router Export Rules (Critical)
- **Failure:** `src/app/(public)/layout.tsx` and `page.tsx` files failed Vercel build with "is not a valid Page/Layout export field".
- **Cause:** Mixed use of named exports (`export function X`) and default exports (`export default X`) caused confusion in Next.js build system.
- **Lesson:** **ALWAYS** use a single `export default function Page()` or `export default function Layout()` in App Router files. Do not use named exports for pages/layouts.

## 2. Vercel & Next.js Version Compatibility (Build Environment)
- **Failure:** `ENOENT: no such file or directory ... page_client-reference-manifest.js` error persisted even after cache clear.
- **Cause:** Compatibility bug between Next.js 14.2.33 and Vercel's build environment.
- **Lesson:** When hitting persistent `ENOENT` manifest errors on Vercel, upgrading to the latest stable Next.js (`npm install next@latest`) is often the fastest fix.

## 3. Next.js 15+ Breaking Changes (Async Cookies)
- **Failure:** `Property 'getAll' does not exist on type 'Promise<ReadonlyRequestCookies>'`.
- **Cause:** In Next.js 15, `cookies()` helper became asynchronous (`await cookies()`), breaking legacy synchronous usage.
- **Lesson:** When upgrading to Next.js 15, **ALWAYS** check server-side APIs (`cookies`, `headers`, `params`). Update code to use `await` (e.g., `const cookieStore = await cookies()`).

## 4. Import Omissions (Basic Hygiene)
- **Failure:** `Type error: Cannot find name 'Button'`.
- **Cause:** Used a UI component (`Button`) in `ServicePanel.tsx` without importing it.
- **Lesson:** **NEVER** assume imports are automatic. Always verify that used components are imported at the top of the file before committing. Double-check `import` statements when refactoring JSX.

## 5. Vercel Deployment & Git Sync
- **Failure:** Vercel kept building an old commit despite new pushes.
- **Cause:** Git webhook delay or Vercel build queue getting stuck on a failed previous build.
- **Lesson:** If Vercel seems stuck on an old commit, use `git log` to verify local/remote sync, and if needed, use Vercel CLI (`vercel --force`) or re-import the project to force a fresh state.
