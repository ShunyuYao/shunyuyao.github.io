# PRD: Module 5 — Content Data Layer & Homepage Sections

## Introduction

Migrate all personal content from `index.html` into structured JSON data files, then build the homepage content modules (Now, Work, Papers, Press, Awards) using a reusable `SectionContainer` component architecture inspired by Anand Chowdhary's `GenericSection` pattern.

**Priority:** 🟠 High
**Estimated time:** 2–3 days
**Depends on:** Module 1 (project init)

---

## Goals

- All content lives in `content/*.json` files — no hardcoded text in components
- Homepage shows six content modules in a responsive grid (3-col → 2-col → 1-col)
- Each module shows a preview (latest 3 items) with a "View all" link
- Hover state highlights each module's card (desktop)
- Mobile: single column, description text always visible

---

## User Stories

### US-001: Create content JSON data files

**Description:** As a developer, I need structured JSON data files so that all content is maintainable, type-safe, and decoupled from UI components.

**Acceptance Criteria:**
- [ ] `content/now.json` exists with `{ updatedAt: string, items: [{ text: string, textEn: string }] }` shape — at least 3 items
- [ ] `content/work.json` exists as an array with at least 2 entries (OneStory, Voka), each with: `id, name, nameZh, org, orgZh, period, periodZh, role, roleZh, description, descriptionZh, highlights[], highlightsZh[], links[], logo`
- [ ] `content/papers.json` exists as an array with all 6 papers (LAMIC AAAI 2026, DialogueNeRF, DFA-NeRF, Poxture, Deep Audio-Visual Fusion, HPOF), each with: `id, title, authors[], venue, year, links[], note?`
- [ ] `content/press.json` exists with at least 1 entry (Zhou Hongyi Bilibili video), each with: `id, title, titleEn, outlet, date, url, type`
- [ ] `content/awards.json` exists with at least 5 entries, each with: `year, title, titleEn, org`
- [ ] All JSON files are valid JSON and TypeScript can resolve them via `import data from '@/content/xxx.json'`
- [ ] Typecheck passes (`npx tsc --noEmit`) — `resolveJsonModule: true` must be set in tsconfig.json

### US-002: Build the SectionContainer component

**Description:** As a developer, I need a reusable section wrapper so all content modules share consistent layout, hover effects, and typography.

**Acceptance Criteria:**
- [ ] `app/components/SectionContainer.tsx` exists with a named export `SectionContainer`
- [ ] Props: `title: string`, `titleZh?: string`, `subtitle: string` (URL path), `description: string`, `linkText: string`, `lang?: 'zh' | 'en'`, `children: React.ReactNode`
- [ ] Renders a `<section>` with `space-y-4 relative group`
- [ ] Has a hover highlight overlay: `absolute -z-10 -top-4 -bottom-8 -right-8 -left-8 bg-neutral-900 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`
- [ ] Section title styled: `text-xs uppercase font-medium font-mono tracking-wider text-neutral-500`, inside a `<Link>` to the subtitle path
- [ ] Description + linkText paragraph at bottom: `md:opacity-0 md:group-hover:opacity-100 transition-opacity` (always visible on mobile)
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-003: Build NowSection component

**Description:** As a user, I want to see what Shunyu Yao is currently doing on the homepage so I get a sense of his current focus.

**Acceptance Criteria:**
- [ ] `app/components/NowSection.tsx` exists
- [ ] Reads from `content/now.json`
- [ ] Displays all items as a `<ul>` with bullet markers (`list-disc marker:text-neutral-600`)
- [ ] Shows Chinese text when `lang='zh'`, English when `lang='en'`
- [ ] Wrapped in `SectionContainer` with title `now`, subtitle `/now`, appropriate description and linkText
- [ ] Typecheck passes, lint passes

### US-004: Build WorkSection component

**Description:** As a user, I want to see Shunyu Yao's key work experience on the homepage so I can quickly understand his professional background.

**Acceptance Criteria:**
- [ ] `app/components/WorkSection.tsx` exists
- [ ] Reads from `content/work.json`, shows at most 3 items
- [ ] Each item shows: logo image (if available, `w-8 h-8 rounded`), name, role · org (localized)
- [ ] Wrapped in `SectionContainer` with title `work`, titleZh `工作经历`, subtitle `/work`
- [ ] Typecheck passes, lint passes

### US-005: Build PapersSection component

**Description:** As a user, I want to see Shunyu Yao's recent academic papers on the homepage so I understand his research focus.

**Acceptance Criteria:**
- [ ] `app/components/PapersSection.tsx` exists
- [ ] Reads from `content/papers.json`, shows at most 3 items (most recent first, sorted by `year` desc)
- [ ] Each paper shows: truncated title (text-sm, text-neutral-300), venue in accent color, paper/code links
- [ ] All paper links have `relative z-10` so they are clickable above the fluid canvas
- [ ] Wrapped in `SectionContainer` with title `papers`, titleZh `论文`, subtitle `/papers`
- [ ] Typecheck passes, lint passes

### US-006: Build PressSection and AwardsSection components

**Description:** As a user, I want to see Shunyu Yao's media appearances and awards so I can assess his public profile.

**Acceptance Criteria:**
- [ ] `app/components/PressSection.tsx` exists, reads `content/press.json`, shows up to 3 items with outlet + title as link
- [ ] `app/components/AwardsSection.tsx` exists, reads `content/awards.json`, shows up to 4 items with year + title
- [ ] Both wrapped in `SectionContainer` with correct titles, subtitles
- [ ] All external links have `relative z-10`, `target="_blank" rel="noopener noreferrer"`
- [ ] Typecheck passes, lint passes

### US-007: Assemble homepage grid layout

**Description:** As a user, I want to see all content modules on the homepage in a responsive grid so I can browse Shunyu Yao's profile at a glance.

**Acceptance Criteria:**
- [ ] `app/page.tsx` renders sections in this order: `<Header>` → `<HeroSection>` → `<NowSection>` (full-width) → responsive grid with Work, Papers, Press, Awards → `<Footer>`
- [ ] Grid classes: `grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-16 max-w-5xl mx-auto`
- [ ] Page container has `p-8 sm:p-20 space-y-32`
- [ ] `resolveJsonModule: true` is set in `tsconfig.json`
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] `npm run build` succeeds

---

## Functional Requirements

- FR-1: All content data must be in `content/*.json` files — no hardcoded strings in section components
- FR-2: Each JSON file must have both Chinese and English fields for bilingual support
- FR-3: `SectionContainer` hover highlight is desktop-only; description text is always visible on mobile
- FR-4: Section title links navigate to the corresponding sub-page route
- FR-5: Paper links with `href` must have `relative z-10` to be clickable above the fluid canvas
- FR-6: Grid is responsive: 1-col on mobile, 2-col on `lg`, 3-col on `xl`
- FR-7: `content/papers.json` items are sorted by `year` descending before displaying

## Non-Goals

- No sub-pages yet (those are Module 6)
- No internationalized URLs yet (Module 7)
- No About or Education sections in this module (deferred to Module 6)
- No `content/archive.json` yet (Module 8)

## Data Schemas

### content/now.json
```json
{
  "updatedAt": "2026-03",
  "items": [
    { "text": "中文内容", "textEn": "English content" }
  ]
}
```

### content/work.json (array item)
```json
{
  "id": "onestory",
  "name": "OneStory",
  "nameZh": "OneStory",
  "org": "Chuangyi Technology",
  "orgZh": "创壹科技",
  "period": "2022 – present",
  "periodZh": "2022 至今",
  "role": "AI Product Lead",
  "roleZh": "AI 产品负责人",
  "description": "...",
  "descriptionZh": "...",
  "highlights": ["250K+ registered users in one year"],
  "highlightsZh": ["一年内注册用户超 25 万"],
  "links": [{ "label": "Global", "url": "https://global.onestory.art" }],
  "logo": "/images/logos/onestory.png"
}
```

### content/papers.json (array item)
```json
{
  "id": "lamic",
  "title": "LAMIC: Layout-Aware Multi-Image Composition...",
  "authors": ["Yuzhuo Chen", "Shunyu Yao*"],
  "venue": "AAAI 2026",
  "year": 2026,
  "links": [{ "label": "paper", "url": "https://arxiv.org/abs/2508.00477" }],
  "note": "Corresponding author"
}
```

## Success Metrics

- All 6 content sections visible on homepage
- Hover effects work on desktop
- Mobile single-column layout looks good at 375px
- No hardcoded content strings in any section component
- `npm run build` succeeds
