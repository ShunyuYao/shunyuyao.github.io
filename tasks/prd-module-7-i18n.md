# PRD: Module 7 — Bilingual Routing (中英文双语)

## Introduction

Migrate the site from single-language to a fully URL-based bilingual system. Use `next-intl` for the App Router with `[locale]` dynamic segments, supporting `/zh/` (Chinese) and `/en/` (English) routes. Root `/` auto-redirects based on browser language.

**Priority:** 🟡 Medium
**Estimated time:** 1.5 days
**Depends on:** Module 1, 5, 6

---

## Goals

- URL-level language separation: `/zh/papers` and `/en/papers` are distinct, SEO-indexable pages
- Browser language detection at root `/` redirects to the correct locale
- Language toggle button switches locale in the URL
- All `<html lang="...">` attributes set correctly
- `npm run build` produces both `/zh/` and `/en/` directories in the static output

---

## User Stories

### US-001: Install and configure next-intl

**Description:** As a developer, I need `next-intl` configured so the app supports locale-based routing.

**Acceptance Criteria:**
- [ ] `next-intl` is added to `package.json` and `package-lock.json` (run `npm install next-intl`)
- [ ] `i18n/routing.ts` exists and exports `routing` using `defineRouting({ locales: ['zh', 'en'], defaultLocale: 'zh', localeDetection: true })`
- [ ] `i18n/request.ts` exists with `next-intl` server-side config
- [ ] `next.config.ts` is updated to use `createNextIntlPlugin` (or the `plugin` wrapper as required by next-intl docs for the installed version)
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-002: Create translation JSON files

**Description:** As a developer, I need Chinese and English translation files so all UI text strings can be served in the correct language.

**Acceptance Criteria:**
- [ ] `i18n/zh.json` exists with keys: `site.title`, `site.description`, `nav.*` (now/work/papers/press/awards/about/archive), `hero.*` (titles array, subtitle, cta_primary, cta_secondary), `now.*`, `work.*`, `papers.*`, `press.*`, `awards.*`, `footer.*`
- [ ] `i18n/en.json` exists with the same key structure in English
- [ ] Both files are valid JSON
- [ ] TypeScript can import them (or next-intl loads them dynamically)

### US-003: Restructure app routes under [locale]

**Description:** As a developer, I need all page routes moved under `app/[locale]/` so each page is served at the correct locale URL.

**Acceptance Criteria:**
- [ ] All existing pages moved: `app/page.tsx` → `app/[locale]/page.tsx`, `app/now/page.tsx` → `app/[locale]/now/page.tsx`, etc.
- [ ] `app/[locale]/layout.tsx` exists, sets `<html lang={locale}>` attribute
- [ ] `app/[locale]/layout.tsx` wraps children with `NextIntlClientProvider` with the locale's messages
- [ ] All pages use `useTranslations` (or `getTranslations` for server components) for UI strings
- [ ] `generateStaticParams` is added to `app/[locale]/layout.tsx` returning `[{ locale: 'zh' }, { locale: 'en' }]`
- [ ] All dynamic sub-routes (e.g. `[id]` inside `work`) also implement `generateStaticParams` returning params for both locales
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-004: Implement root redirect for language detection

**Description:** As a user, I want visiting the root URL `/` to redirect me to the correct language based on my browser settings.

**Acceptance Criteria:**
- [ ] `app/page.tsx` (root, outside `[locale]`) exists as a `"use client"` component
- [ ] On mount, detects `navigator.language`: if it starts with `zh`, calls `router.replace('/zh')`; otherwise calls `router.replace('/en')`
- [ ] Shows a blank/minimal loading state while redirecting
- [ ] OR: a `middleware.ts` is created (for Cloudflare Pages / non-GitHub-Pages deploy) that handles the redirect server-side
- [ ] Typecheck passes, lint passes

### US-005: Update LanguageSwitch component for next-intl

**Description:** As a user, I want the language switch button to correctly navigate between `/zh/...` and `/en/...` URLs.

**Acceptance Criteria:**
- [ ] `app/[locale]/components/LanguageSwitch.tsx` is updated to use `useLocale()` from `next-intl`
- [ ] Clicking `EN` when on `/zh/papers` navigates to `/en/papers`
- [ ] Clicking `中文` when on `/en/papers` navigates to `/zh/papers`
- [ ] Button label correctly shows the opposite locale: displays `EN` when locale is `zh`, displays `中文` when locale is `en`
- [ ] `<html lang>` attribute updates after navigation
- [ ] Typecheck passes, lint passes

### US-006: Update metadata for locale-aware SEO

**Description:** As a developer, I want each page to have locale-specific metadata so both language versions are properly indexed.

**Acceptance Criteria:**
- [ ] `app/[locale]/layout.tsx` exports `generateMetadata` function
- [ ] Title: `姚顺宇` for `zh`, `Shunyu Yao` for `en`; template: `%s | 姚顺宇` / `%s | Shunyu Yao`
- [ ] Description is set in the correct language
- [ ] `alternates.canonical` set to `https://shunyuyao.github.io/{locale}`
- [ ] `alternates.languages` includes both `zh-CN` and `en-US` URLs
- [ ] `<html lang>` is set correctly for each locale
- [ ] Typecheck passes, lint passes

### US-007: Verify build output and all locale routes

**Description:** As a developer, I need to confirm the static build generates both `/zh/` and `/en/` directories.

**Acceptance Criteria:**
- [ ] `npm run build` succeeds
- [ ] Build output `out/` directory contains both `/zh/` and `/en/` folders
- [ ] All pages accessible: `/zh/`, `/zh/papers`, `/zh/work`, `/zh/now`, `/en/`, `/en/papers`, etc.
- [ ] Root `/` redirects to `/zh` or `/en` based on browser language (verify client-side)
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

---

## Functional Requirements

- FR-1: All routes are under `app/[locale]/` with `locales: ['zh', 'en']` and `defaultLocale: 'zh'`
- FR-2: `<html lang>` attribute is set to the current locale on every page
- FR-3: Root `/` performs client-side language detection and redirects
- FR-4: Language toggle navigates between matching paths in the two locales
- FR-5: `generateStaticParams` in `[locale]` layout returns both locales
- FR-6: All content JSON bilingual fields (`text`/`textEn`, `description`/`descriptionZh`, etc.) are consumed via locale parameter
- FR-7: `npm run build` outputs `/zh/` and `/en/` directories

## URL Structure

```
shunyuyao.github.io/           → client-side redirect based on browser lang
shunyuyao.github.io/zh/        → Chinese homepage
shunyuyao.github.io/en/        → English homepage
shunyuyao.github.io/zh/papers  → Chinese papers page
shunyuyao.github.io/en/papers  → English papers page
shunyuyao.github.io/zh/work/onestory  → Chinese work detail
```

## Directory Structure Change

```
app/
├── page.tsx                   ← root redirect (client-side)
├── [locale]/
│   ├── layout.tsx             ← sets <html lang>, wraps NextIntlClientProvider
│   ├── page.tsx               ← homepage
│   ├── now/page.tsx
│   ├── work/page.tsx
│   ├── work/[id]/page.tsx
│   ├── papers/page.tsx
│   ├── press/page.tsx
│   ├── awards/page.tsx
│   ├── about/page.tsx
│   └── archive/page.tsx
├── middleware.ts              ← optional, for server-side redirect on Cloudflare
└── i18n/
    ├── routing.ts
    ├── request.ts
    ├── zh.json
    └── en.json
```

## Non-Goals

- No automatic translation of JSON content — all bilingual content is manually authored in JSON
- No right-to-left (RTL) language support
- No region-specific variants (only `zh` and `en`, not `zh-TW` or `en-GB`)

## Technical Notes

- **GitHub Pages caveat**: GitHub Pages is static-only, so `middleware.ts` won't run server-side. Use the client-side root redirect approach (`app/page.tsx`) for GitHub Pages. For Cloudflare Pages, middleware works natively.
- **next-intl version**: Check the installed version; `createNextIntlPlugin` API may differ between v3 and v4. Follow the official docs for the installed version.
- **Static export**: `output: 'export'` in `next.config.ts` requires that all locale routes are pre-rendered via `generateStaticParams`.

## Success Metrics

- Both `/zh/` and `/en/` trees are present in the build output
- Language toggle works correctly on all pages
- `<html lang>` attribute is correct for each locale
- SEO metadata is locale-specific
- `npm run build` succeeds with no errors
