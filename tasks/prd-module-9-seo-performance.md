# PRD: Module 9 — SEO & Performance Optimization

## Introduction

Final polish module to maximize discoverability and page speed. Configure complete metadata and structured data, generate an OpenGraph image for social sharing, optimize fonts and images, add `sitemap.xml` and `robots.txt`, and hit Lighthouse score targets.

**Priority:** 🟢 Low
**Estimated time:** 1 day
**Depends on:** All previous modules

---

## Goals

- Lighthouse Performance > 90 (desktop), > 85 (mobile)
- Lighthouse SEO = 100
- Correct OpenGraph / Twitter card for all pages
- `sitemap.xml` covering all zh/en pages
- `robots.txt` allowing full crawl
- Structured data (Schema.org `Person`)
- No console errors in production build

---

## User Stories

### US-001: Configure complete metadata in layout

**Description:** As a developer, I need comprehensive metadata on every page so search engines and social platforms correctly index and display the site.

**Acceptance Criteria:**
- [ ] `app/[locale]/layout.tsx` exports `generateMetadata` function accepting `{ params: { locale: string } }`
- [ ] `title.default`: `姚顺宇` (zh) or `Shunyu Yao` (en)
- [ ] `title.template`: `%s | 姚顺宇` (zh) or `%s | Shunyu Yao` (en)
- [ ] `description` set in the correct language (60–160 chars)
- [ ] `authors`: `[{ name: 'Shunyu Yao', url: 'https://shunyuyao.github.io' }]`
- [ ] `openGraph.type`: `website`
- [ ] `openGraph.url`: `https://shunyuyao.github.io`
- [ ] `openGraph.locale`: `zh_CN` or `en_US`
- [ ] `twitter.card`: `summary_large_image`
- [ ] `alternates.canonical`: `https://shunyuyao.github.io/{locale}`
- [ ] `alternates.languages`: includes both `zh-CN` and `en-US` URLs
- [ ] Each sub-page's `page.tsx` exports a `metadata` object with a page-specific `title`
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-002: Add Schema.org structured data

**Description:** As a developer, I need a JSON-LD `Person` schema so search engines understand who this site is about.

**Acceptance Criteria:**
- [ ] `app/components/PersonSchema.tsx` exists as a server component with a default export
- [ ] Renders a `<script type="application/ld+json">` tag with correct JSON-LD
- [ ] Schema includes: `@type: Person`, `name: Shunyu Yao`, `alternateName: 姚顺宇`, `url`, `jobTitle`, `worksFor.name: Chuangyi Technology`, `alumniOf` array (SJTU, XJTU), `email: ysy2017@sjtu.edu.cn`, `sameAs` array (onestory.art, github.com/ShunyuYao)
- [ ] `PersonSchema` is mounted in `app/[locale]/layout.tsx`
- [ ] Typecheck passes, lint passes

### US-003: Create static OG image

**Description:** As a user sharing the site on WeChat or Twitter, I want a branded preview image to appear so the link looks professional.

**Acceptance Criteria:**
- [ ] A static OG image exists at `public/og/default.png` (1200×630px)
- [ ] Image shows: name "Shunyu Yao · 姚顺宇", tagline "AIGC Researcher & Product Builder", site URL `shunyuyao.github.io`, dark background
- [ ] Image can be created manually (e.g. using Figma or a design tool) and committed as a static asset
- [ ] `app/[locale]/layout.tsx` `openGraph.images` points to `https://shunyuyao.github.io/og/default.png`
- [ ] `twitter.images` also points to the OG image

### US-004: Optimize fonts

**Description:** As a user on a slow connection, I want the page to load quickly even with custom fonts loaded.

**Acceptance Criteria:**
- [ ] Inter font is loaded via `next/font/google` in `app/layout.tsx` (outside `[locale]`) with `subsets: ['latin']`, `display: 'swap'`, weights `['400', '500', '600', '700']`
- [ ] `Ma Shan Zheng` (calligraphy font for 姚顺宇 subtitle) is loaded with Google Fonts `preconnect` + stylesheet link, `display=swap`
- [ ] NO full Noto Sans SC loaded globally — use system font fallback for Chinese body text: `"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif`
- [ ] CSS `font-family` stack in `globals.css` or Tailwind config is: `Inter → -apple-system → PingFang SC → Noto Sans CJK SC → Microsoft YaHei → sans-serif`
- [ ] Typecheck passes, lint passes

### US-005: Optimize images

**Description:** As a developer, I need all images to use `next/image` so they are automatically converted to WebP and lazy-loaded.

**Acceptance Criteria:**
- [ ] All `<img>` tags in the codebase replaced with `next/image` `<Image>` component
- [ ] Avatar image on `/about` page uses `priority` prop (above the fold)
- [ ] All logo images in Work section use appropriate `width` and `height` props
- [ ] `public/images/` directory has a `.gitkeep` or at least a placeholder avatar if no real photo yet
- [ ] Typecheck passes, lint passes

### US-006: Generate sitemap.xml

**Description:** As a developer, I need a `sitemap.xml` so search engines can discover all pages in both languages.

**Acceptance Criteria:**
- [ ] `app/sitemap.ts` exists and exports a default function returning a `MetadataRoute.Sitemap` array
- [ ] Covers all pages: `''`, `/now`, `/work`, `/papers`, `/press`, `/awards`, `/about`, `/archive` for both `zh` and `en` locales
- [ ] Each entry has `url`, `lastModified`, `changeFrequency`, and `priority` (homepage: 1.0, others: 0.8)
- [ ] `npm run build` generates `out/sitemap.xml` (verify file exists in build output)
- [ ] Typecheck passes, lint passes

### US-007: Add robots.txt

**Description:** As a developer, I need `robots.txt` to allow full crawling and reference the sitemap.

**Acceptance Criteria:**
- [ ] `app/robots.ts` exists (or `public/robots.txt`) allowing all crawlers (`User-agent: *`, `Allow: /`)
- [ ] References sitemap URL: `Sitemap: https://shunyuyao.github.io/sitemap.xml`
- [ ] `npm run build` generates `out/robots.txt`
- [ ] Typecheck passes if using `app/robots.ts`

### US-008: Run Lighthouse and fix top issues

**Description:** As a developer, I need to verify performance and SEO scores meet targets and fix any blocking issues.

**Acceptance Criteria:**
- [ ] Run Lighthouse on the production build (serve `out/` with `npx serve out` and run Lighthouse in Chrome DevTools)
- [ ] Desktop Performance score > 90
- [ ] Mobile Performance score > 85
- [ ] SEO score = 100
- [ ] Accessibility score > 95
- [ ] Best Practices score = 100
- [ ] All images have `alt` text
- [ ] All interactive elements have accessible labels
- [ ] No console errors in production
- [ ] Fix any issues found until scores meet targets
- [ ] `npm run build` succeeds

---

## Functional Requirements

- FR-1: Every page has `<title>` in format `PageName | Shunyu Yao` and a `<meta name="description">`
- FR-2: `<html lang>` is set correctly for all pages (handled by Module 7, verified here)
- FR-3: OG image is 1200×630px and correctly referenced in metadata
- FR-4: `sitemap.xml` includes all zh and en page URLs
- FR-5: `robots.txt` allows all crawlers and references the sitemap
- FR-6: No full Chinese font (Noto Sans SC) is loaded globally — system fonts handle Chinese body text
- FR-7: All `<img>` tags use `next/image`

## Lighthouse Score Targets

| Metric | Target |
|--------|--------|
| Performance (desktop) | > 90 |
| Performance (mobile) | > 85 |
| Accessibility | > 95 |
| Best Practices | 100 |
| SEO | 100 |

## Font Stack (globals.css or Tailwind)

```css
font-family:
  "Inter",
  -apple-system,
  "PingFang SC",        /* iOS/macOS */
  "Noto Sans CJK SC",   /* Android */
  "Microsoft YaHei",    /* Windows */
  sans-serif;
```

## Non-Goals

- No dynamic OG image generation (static pre-generated PNG is sufficient)
- No analytics integration (no Google Analytics, no Plausible)
- No service worker or PWA
- No A/B testing

## Success Metrics

- Lighthouse SEO = 100 on both zh and en pages
- Lighthouse Performance ≥ 90 desktop, ≥ 85 mobile
- `sitemap.xml` and `robots.txt` present in build output
- OG image displays correctly when sharing on WeChat/Twitter
- `npm run build` succeeds with zero errors
