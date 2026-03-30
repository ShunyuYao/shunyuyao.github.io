# PRD: Module 4 — Hero Section

## Introduction

Build the full-viewport Hero section for the homepage. This is the first content block visitors see — it showcases Shunyu Yao's core identity with a typewriter-animated title, subtitle tag line, two CTA buttons, and a scroll-down indicator. The fluid cursor from Module 2 is most impactful here, so z-index layering must be correct.

**Priority:** 🔴 Highest
**Estimated time:** 1 day
**Depends on:** Module 1, 2 (fluid cursor), 3 (header)

---

## Goals

- Immediately communicate who Shunyu Yao is through an animated typewriter title
- Provide two clear CTAs: OneStory external link and internal "View My Work" link
- Add a subtle scroll-down arrow that disappears after scrolling
- Ensure both CTA buttons are fully clickable above the fluid cursor canvas
- Add noise-texture background that makes the fluid cursor colors pop

---

## User Stories

### US-001: Create the TypewriterTitle component

**Description:** As a user, I want to see an animated title that cycles through identity labels so the hero feels dynamic and memorable.

**Acceptance Criteria:**
- [ ] `app/components/TypewriterTitle.tsx` exists as a `"use client"` component with a default export
- [ ] Component accepts a `lang: 'zh' | 'en'` prop (default `'zh'`)
- [ ] Chinese titles cycle through: `['AIGC 研究者', '产品负责人', 'AI 内容创作者', '数字人技术专家']`
- [ ] English titles cycle through: `['AIGC Researcher', 'Product Builder', 'AI Content Creator', 'Digital Human Engineer']`
- [ ] Typewriter effect: characters appear one by one (80ms per char), wait 2000ms, then delete (40ms per char), then next title
- [ ] A blinking `|` cursor is shown after the displayed text (`animate-pulse`)
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-002: Create the HeroSection component

**Description:** As a user, I want to see a full-viewport hero with my identity, a subtitle, and two action buttons when I first land on the site.

**Acceptance Criteria:**
- [ ] `app/components/HeroSection.tsx` exists with a default export
- [ ] Component accepts a `lang: 'zh' | 'en'` prop (default `'zh'`)
- [ ] Uses `<TypewriterTitle>` as the main `<h1>` (text-4xl sm:text-5xl lg:text-6xl, font-bold)
- [ ] Subtitle shown below title:
  - Chinese: `上海 · AI · 内容创作 · 数字人`
  - English: `Shanghai · AI · Content · Digital Human`
  - Style: `text-neutral-500 font-mono text-sm tracking-wider`
- [ ] **OneStory CTA button**: external link to `https://www.onestory.art`, with animated pulse dot, rounded-full, accent background
- [ ] **"View My Work" CTA button**: internal `<Link>` to `/work` (or `/zh/work`/`/en/work`), border style, rounded-full
- [ ] Both buttons have `relative z-10` so they are clickable above the fluid canvas
- [ ] Scroll-down arrow (`↓`) displayed at `bottom-8` with `animate-bounce`, color `text-neutral-600`
- [ ] Section has `min-h-[70vh]` with centered flex layout
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-003: Add noise-texture background

**Description:** As a user, I want the page background to have a subtle grain texture so the fluid cursor colors feel more vivid and refined.

**Acceptance Criteria:**
- [ ] `app/globals.css` sets `body` background-color to `#0a0a0a`
- [ ] Inline SVG noise filter is applied as a `background-image` on `body` with `opacity: 0.03`
- [ ] Noise texture does not visibly change page load performance (it's a tiny inline SVG data URI)
- [ ] Fluid cursor colors appear more vibrant against the textured background (verify in browser)
- [ ] Lint passes (`npm run lint`)

### US-004: Integrate HeroSection in the homepage and verify

**Description:** As a user, I want the hero to display correctly on the homepage with all interactive elements working.

**Acceptance Criteria:**
- [ ] `app/page.tsx` renders `<HeroSection />` (below `<Header>`)
- [ ] Typewriter animation cycles through all four titles correctly
- [ ] OneStory button opens `www.onestory.art` in a new tab
- [ ] "View My Work" button navigates correctly (does not 404)
- [ ] Both buttons are clickable when fluid cursor is active (z-index layering correct)
- [ ] Scroll-down arrow is visible and bouncing
- [ ] Mobile layout: title font size reduces gracefully, buttons stack vertically
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] `npm run build` succeeds

---

## Functional Requirements

- FR-1: Hero section occupies at least 70vh height, content vertically centered
- FR-2: TypewriterTitle cycles through titles with typing (80ms/char) → wait (2s) → delete (40ms/char) loop
- FR-3: OneStory CTA is an `<a>` tag with `target="_blank" rel="noopener noreferrer"`
- FR-4: Both CTAs have `relative z-10` (above the fluid canvas at `z-[2]`)
- FR-5: Body background is `#0a0a0a` with a noise texture overlay at `opacity: 0.03`
- FR-6: Scroll-down arrow auto-bounces; optionally fades out after scrolling past Hero (nice-to-have, not required)

## Non-Goals

- No scroll-triggered parallax or complex scroll animations
- No full internationalization yet (lang prop wires up content, but URL routing is Module 7)
- No video or background image in Hero — only color + noise texture + fluid cursor

## Visual Layout

```
┌──────────────────────────────────────────────────┐
│  [流体光标 Canvas，覆盖全页，z-index:2]           │
│                                                  │
│  [Header：签名 + 语言切换]                        │
│                                                  │
│          AIGC Researcher                         │
│          & Product Builder     ← typewriter loop │
│                                                  │
│     上海 · AI · 内容创作 · 数字人                 │
│                                                  │
│   [● OneStory →]   [● 查看我的工作 →]            │
│                                                  │
│        ↓（scroll indicator, animate-bounce）      │
└──────────────────────────────────────────────────┘
```

## Technical Notes

- Typewriter effect should handle language switching mid-animation gracefully (reset state when `lang` changes)
- CTA button accent color: use Tailwind `bg-accent` (requires defining `accent` in `tailwind.config.ts` — e.g. `accent: '#E8D5C4'`)
- The scroll arrow can be hidden with `IntersectionObserver` watching the next section — this is optional polish

## Success Metrics

- Typewriter cycles through all four titles without glitches
- Both CTA buttons are clickable with fluid cursor active
- Mobile layout looks good at 375px width
- `npm run build` succeeds
