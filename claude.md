# Auto-Quote Paving System Context & Rules

## 1. Project Identity
- **Name:** Auto-Quote Paving System
- **Goal:** Self-service web platform for pavement/lane painting estimation.
- **Key Logic:** Dynamic pricing based on area/options with a "Minimum Mobilization Cost" floor.

## 2. Tech Stack (Strict Version)
- **Frontend:** Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **UI Lib:** Shadcn/ui (Radix UI based), Lucide React
- **State:** Zustand (Client global), React Hook Form + Zod (Form validation)
- **Backend:** Next.js Server Actions (No API Routes), Supabase (DB/Auth)
- **Styling:** Tailwind CSS (Mobile First)

## 3. Directory Structure
Follow this Feature-based architecture strictly. Do not create flat structures.
```
/src
  /app                # Next.js App Router
    /(public)         # Public access pages
    /(admin)          # Admin protected pages
  /components
    /ui               # Primitive UI (Buttons, Inputs - from shadcn)
    /shared           # Shared components used across features
  /features           # ★ Domain Logic (Colocate components, hooks, stores)
    /quote            # Feature: Estimation Wizard
      /components     # Quote specific UI
      /hooks          # Quote logic hooks
      /store          # Zustand store (useQuoteStore)
      /utils.ts       # Pricing calculation pure functions
    /admin            # Feature: Dashboard
  /lib                # Global utils (supabase client, cn helper)
  /types              # Global types (Database definitions)
```

## 4. Coding Guidelines (The "Law")

### 4.1 TypeScript & Syntax
- **STRICT MODE:** No `any`. No `// @ts-ignore`. Explicitly type all props and return values.
- **Functional Components:** Use `const Component = () => {}` with named exports. Avoid `default export`.
- **Imports:** ALWAYS use absolute imports (`@/components/...`). Do not use relative paths (`../../`).

### 4.2 Next.js App Router Rules
- **Server Components:** All components are Server Components by default.
- **Client Components:** Add `'use client'` at the very top only when:
  - Using `useState`, `useEffect`, `useRef`.
  - Using event listeners (`onClick`, `onChange`).
  - Using browser APIs (`window`, `localStorage`).
- **Data Fetching:** Use **Server Actions** directly in Server Components. Avoid `useEffect` for data fetching unless absolutely necessary.

### 4.3 UI & Styling Rules
- **Tailwind:** Use utility classes. Do not create `.css` files or `styled-components`.
- **Responsiveness:** Mobile-first approach. (e.g., `class="w-full md:w-1/2"`).
- **Shadcn UI:** When using `className` props, ALWAYS wrap with `cn()` utility to allow overrides.
  - *Bad:* `<Button className="bg-red-500" />`
  - *Good:* `<Button className={cn("bg-red-500", className)} />`

### 4.4 State Management Rules
- **Form State:** Use `react-hook-form` for all input forms. Do not use local `useState` for complex forms.
- **Global State:** Use `Zustand` for the Quote Wizard step data (to persist data between steps).

## 5. Business Logic (Core Constraints)
**CRITICAL: Pricing Algorithm**
When implementing `calculateQuote(input)`:
1. Calculate `baseCost` = (Quantity * UnitPrice).
2. Calculate `optionCost` = Sum(Option * OptionPrice).
3. Apply `surcharge` if (SurfaceCondition == Bad).
4. **Final Check (Mobilization Cost):**
   ```typescript
   // This logic must never be omitted
   if (total < MIN_MOBILIZATION_COST) {
     return MIN_MOBILIZATION_COST; // e.g., 500,000 KRW
   }
   ```
Never show a price lower than the minimum cost.

## 6. Implementation Roadmap (Checklist)

### Phase 1: Foundation
- [ ] Initialize Next.js 14 + Supabase + Tailwind.
- [ ] Setup src/features folder structure.
- [ ] Install Shadcn UI & Icons.

### Phase 2: Core Logic (Backend First)
- [ ] Define Supabase Tables (services, materials, quotes).
- [ ] Implement calculateQuote utility with Jest tests.
- [ ] Create Server Actions for fetching pricing data.

### Phase 3: UI Implementation
- [ ] Build Quote Wizard UI (Step 1 -> Step 4).
- [ ] Connect Zustand store to Wizard inputs.
- [ ] Visualize Real-time Price updates.
