# PRD: Module 8 — Footer & Archive Timeline

## Introduction

Build the site-wide footer and the `/archive` page. The footer shows a small signature logo, navigation links, tagline, and copyright. The archive is a chronological timeline of all activities (papers, product milestones, awards, press) displayed in reverse-chronological order by year — a key personal branding asset.

**Priority:** 🟢 Low
**Estimated time:** 1 day
**Depends on:** Module 5, 6

---

## Goals

- Consistent, elegant footer on every page with full navigation
- `/archive` page lists all activities by year in reverse order
- Homepage shows a preview of the 5 most recent archive entries
- Activity types are visually distinguished with emoji icons
- Chinese/English content switches correctly

---

## User Stories

### US-001: Build the Footer component

**Description:** As a user, I want to see a footer on every page with navigation links and copyright so I can easily navigate the site from the bottom.

**Acceptance Criteria:**
- [ ] `app/components/footer.tsx` is updated with a `Footer` component accepting `lang?: 'zh' | 'en'` prop
- [ ] Footer contains a small `<AnimatedSignature>` (or static SVG) at `w-16 mx-auto`, linked to `/`
- [ ] Footer tagline: `AIGC 研究者 & 产品负责人 · 上海` (zh) or `AIGC Researcher & Product Builder · Shanghai` (en), in `text-xs uppercase font-mono tracking-wider text-neutral-600`
- [ ] Footer navigation includes links to: Now/近况, Work/工作, Papers/论文, Press/媒体, Awards/荣誉, About/关于, Archive/存档
- [ ] All footer nav links have `relative z-10` so they are clickable
- [ ] Copyright line: `© 2026 Shunyu Yao · Last updated: March 2026` / `© 2026 姚顺宇 · 最后更新：2026年3月`
- [ ] Footer has a vertical divider `div` (1px, `bg-neutral-800`, `h-16`) above the signature
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-002: Create content/archive.json data file

**Description:** As a developer, I need a single `archive.json` file with all timeline entries so the archive page and homepage preview can read from a single source of truth.

**Acceptance Criteria:**
- [ ] `content/archive.json` exists as a JSON array
- [ ] Each entry has: `date` (YYYY-MM format), `type` (one of: `paper` | `product` | `award` | `press` | `event`), `title` (Chinese), `titleEn` (English), `url` (string or null)
- [ ] At least 8 entries covering: LAMIC AAAI 2026, OneStory 25万用户, 华为昇腾大赛冠军, 周鸿祎对谈, other awards/milestones
- [ ] Entries are sorted by `date` descending in the file
- [ ] Valid JSON, TypeScript can import it via `@/content/archive.json`

### US-003: Build the /archive page

**Description:** As a user, I want to see all of Shunyu Yao's activities at `/archive` grouped by year so I can quickly understand his trajectory.

**Acceptance Criteria:**
- [ ] `app/archive/page.tsx` (or `app/[locale]/archive/page.tsx` if Module 7 is merged) exists with a default export
- [ ] Reads from `content/archive.json`
- [ ] Entries grouped by year (extracted from `date` field), years shown as `text-xs font-mono uppercase tracking-wider text-neutral-600` headings
- [ ] Each entry shows: month number (2-char, `text-neutral-600 font-mono text-xs w-8`), type emoji icon, title as link (if `url` is non-null) or plain text
- [ ] Type-to-emoji mapping: `paper → 📄`, `product → 🚀`, `award → 🏆`, `press → 🎙️`, `event → 📅`
- [ ] Years sorted descending, entries within each year sorted by month descending
- [ ] Language: shows `title` or `titleEn` based on current lang
- [ ] External links: `target="_blank" rel="noopener noreferrer"`, `relative z-10`
- [ ] Uses `PageLayout` with `pathname="/archive"`
- [ ] Page `<title>` set to `Archive | Shunyu Yao`
- [ ] Typecheck passes, lint passes

### US-004: Build the ArchivePreview component for the homepage

**Description:** As a user, I want to see the 5 most recent archive entries on the homepage so I get a quick sense of recent activities.

**Acceptance Criteria:**
- [ ] `app/components/ArchivePreview.tsx` exists
- [ ] Reads `content/archive.json`, takes the first 5 entries (most recent)
- [ ] Each entry shows: date string (YYYY-MM format, `font-mono text-neutral-600 text-xs w-16`), type emoji, title (localized, truncated with `truncate`)
- [ ] Items as a `<ul className="space-y-3">` with flex row layout
- [ ] Wrapped in `SectionContainer` with `title="archive"`, `subtitle="/archive"`, appropriate description/linkText
- [ ] Typecheck passes, lint passes

### US-005: Mount Footer and ArchivePreview in the homepage and verify

**Description:** As a user, I want the footer and archive preview to appear on the homepage and all sub-pages.

**Acceptance Criteria:**
- [ ] `app/page.tsx` (or `app/[locale]/page.tsx`) renders `<ArchivePreview />` inside the content grid
- [ ] `<Footer />` is rendered at the bottom of the homepage and all sub-page `PageLayout`s
- [ ] Footer navigation links all work (no 404s for existing routes)
- [ ] Archive page shows all entries correctly grouped by year
- [ ] `npm run build` succeeds
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

---

## Functional Requirements

- FR-1: Footer is present on every page via `PageLayout` and the homepage layout
- FR-2: All footer links have `relative z-10` to be clickable above the fluid canvas
- FR-3: Archive entries are grouped by year in descending order
- FR-4: Type emoji icons visually distinguish entry categories
- FR-5: Archive entry links open in new tab with `rel="noopener noreferrer"`
- FR-6: Homepage archive preview shows exactly 5 most recent entries

## Footer Design

```
            [Signature SVG (small, w-16)]

    AIGC Researcher & Product Builder · Shanghai

    Now · Work · Papers · Press · Awards · About · Archive

    © 2026 Shunyu Yao · Last updated: March 2026
```

## Archive Entry Types

| Type | Emoji | Examples |
|------|-------|---------|
| `paper` | 📄 | LAMIC AAAI 2026 |
| `product` | 🚀 | OneStory 25万用户里程碑 |
| `award` | 🏆 | 华为昇腾大赛冠军 |
| `press` | 🎙️ | 对谈周鸿祎 |
| `event` | 📅 | 演讲、会议 |

## content/archive.json Schema

```json
[
  {
    "date": "2026-01",
    "type": "paper",
    "title": "LAMIC 论文录用 AAAI 2026",
    "titleEn": "LAMIC paper accepted at AAAI 2026",
    "url": "https://arxiv.org/abs/2508.00477"
  }
]
```

## Non-Goals

- No infinite scroll or pagination on archive page
- No filtering by type on the archive page (show all)
- No animated transitions between archive entries
- Footer signature does not replay the animation (static or reduced animation is fine)

## Success Metrics

- Footer visible on all pages with working navigation links
- `/archive` shows all entries grouped by year
- Homepage archive preview shows 5 most recent entries
- `npm run build` succeeds
