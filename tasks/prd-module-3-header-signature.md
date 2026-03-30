# PRD: Module 3 — Header & Animated Signature

## Introduction

Build the site-wide header with an animated SVG signature ("Shunyu Yao"), a Chinese subtitle using a calligraphy font, breadcrumb navigation for sub-pages, and a language switch button. This is the first visual element visitors see and sets the overall aesthetic tone of the site.

**Priority:** 🔴 Highest
**Estimated time:** 1 day
**Depends on:** Module 1 (project init)

---

## Goals

- Display an SVG signature that animates as if being "hand-written" on page load
- Show a Chinese name subtitle in a calligraphy-style font
- Show breadcrumb navigation on sub-pages (e.g. `/ papers`)
- Provide an `EN / 中文` language toggle button in the top-right corner
- Signature links back to the homepage

---

## User Stories

### US-001: Create the AnimatedSignature component

**Description:** As a developer, I need a reusable SVG signature component that animates using `stroke-dashoffset` so the header has its core visual element.

**Acceptance Criteria:**
- [ ] `app/components/AnimatedSignature.tsx` exists with a default export
- [ ] Component renders an `<svg>` with at least one `<path>` having `className="signature-path"`
- [ ] SVG placeholder path is included (can be a simple "Shunyu Yao" approximation or a real path from signature-maker.net)
- [ ] `viewBox`, `fill="none"`, and `stroke="currentColor"` are correctly set
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-002: Add signature draw animation CSS

**Description:** As a user, I want to see the signature being "written" when the page loads so the header feels dynamic and personal.

**Acceptance Criteria:**
- [ ] `app/globals.css` contains `.signature-path` with `stroke-dasharray` and `stroke-dashoffset` set to `2000`
- [ ] `@keyframes signature-draw` animates `stroke-dashoffset` from `2000` to `0`
- [ ] Animation duration is `1.5s ease-in-out` with `0.3s` delay and `forwards` fill
- [ ] Animation plays correctly on page load (visible in browser)
- [ ] Lint passes (`npm run lint`)

### US-003: Create the LanguageSwitch component

**Description:** As a user, I want to toggle between English and Chinese so I can read the site in my preferred language.

**Acceptance Criteria:**
- [ ] `app/components/LanguageSwitch.tsx` exists as a `"use client"` component with a default export
- [ ] Button displays `EN` when current language is Chinese, and `中文` when current language is English
- [ ] Language detection is based on the URL pathname (starts with `/zh` → Chinese, `/en` → English)
- [ ] Clicking the button navigates to the corresponding locale URL
- [ ] Button has `relative z-10` so it is not blocked by the fluid canvas
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-004: Build the Header component

**Description:** As a user, I want to see a header on every page with the animated signature, Chinese subtitle, and language toggle so the site has a consistent identity.

**Acceptance Criteria:**
- [ ] `app/components/header.tsx` is updated (or replaced) with a `Header` component accepting a `pathname: string` prop
- [ ] Header renders `AnimatedSignature` inside a `<Link href="/">` with `w-40 sm:w-48` sizing
- [ ] Chinese subtitle `姚顺宇` is displayed below the signature using `font-['Ma_Shan_Zheng']` or similar calligraphy font (Google Fonts: `Ma Shan Zheng`)
- [ ] When `pathname` has sub-segments (e.g. `/papers`), breadcrumb links are displayed below the subtitle
- [ ] `LanguageSwitch` is positioned absolutely at `right-0 top-8`
- [ ] Header `<link>` tags for `Ma Shan Zheng` font are added in `app/layout.tsx` (Google Fonts preconnect + stylesheet)
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-005: Mount updated Header in root layout and verify

**Description:** As a user, I want the header to appear on every page automatically so I don't have to add it to each page manually.

**Acceptance Criteria:**
- [ ] `app/layout.tsx` renders `<Header pathname={...} />` (or header is included via `page.tsx` on all routes)
- [ ] Signature animation plays correctly on first load
- [ ] Clicking the signature navigates to `/`
- [ ] Breadcrumb shows correctly on a sub-page (test with `/papers` if it exists, or a manually created test route)
- [ ] Language switch button is visible and positioned in the top-right
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] `npm run build` succeeds

---

## Functional Requirements

- FR-1: SVG signature uses `stroke-dashoffset` animation to simulate handwriting
- FR-2: Animation begins 0.3s after page load and completes in 1.5s
- FR-3: Signature is always a `<Link href="/">` (clickable, returns to home)
- FR-4: `姚顺宇` subtitle uses a Chinese calligraphy-style Google Font (`Ma Shan Zheng` or `ZCOOL XiaoWei`)
- FR-5: Breadcrumb navigation appears on sub-pages, showing path segments as links
- FR-6: Language toggle button sits at `z-10` minimum, above the fluid cursor canvas
- FR-7: `Ma Shan Zheng` font is loaded via Google Fonts (preconnect in `<head>`)

## Non-Goals

- No dark/light mode toggle in this module (deferred)
- No actual `next-intl` routing yet (that's Module 7) — language switch can be a simple URL replace for now
- No real hand-drawn SVG path required — a placeholder path is acceptable

## Design Reference

```
┌─────────────────────────────────────────────┐
│                                             │
│         [SVG 签名动画 "Shunyu Yao"]          │
│                  姚顺宇                      │
│                                             │  [EN | 中文]
└─────────────────────────────────────────────┘
```

## Technical Notes

- SVG path length must match `stroke-dasharray` value. Use browser console: `document.querySelector('.signature-path').getTotalLength()` to get the real value, then update globals.css
- Placeholder path: use a simple approximation or fetch from signature-maker.net
- Calligraphy font import in `layout.tsx`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap" rel="stylesheet" />
  ```
- Tailwind custom font class: add `'Ma Shan Zheng': ['"Ma Shan Zheng"', 'cursive']` to `tailwind.config.ts` fontFamily

## Success Metrics

- Signature animation plays smoothly on first page load
- Clicking signature navigates to homepage
- Language switch button works without being blocked by fluid canvas
- Breadcrumb shows on `/papers` and other sub-pages
- `npm run build` succeeds
