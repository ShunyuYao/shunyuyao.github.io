# PRD: Module 6 — Sub-pages (Detail Pages)

## Introduction

Build individual sub-pages for each content module. The homepage shows previews (latest 3 items), while sub-pages display full content and richer detail. Implement a shared `PageLayout` component for consistent structure across all sub-pages.

**Priority:** 🟡 Medium
**Estimated time:** 2 days
**Depends on:** Module 1, 5 (content data)

---

## Goals

- Each content module has a dedicated route (`/now`, `/work`, `/papers`, `/press`, `/awards`, `/about`)
- Sub-pages show full content from the JSON data files
- Consistent page layout with breadcrumb navigation
- `/work/[id]` detail page for individual projects
- About page with avatar, bio, education, and contact info
- Page titles are correctly set for each sub-page

---

## User Stories

### US-001: Create the shared PageLayout component

**Description:** As a developer, I need a reusable page layout so all sub-pages share consistent structure (header, main content area, footer).

**Acceptance Criteria:**
- [ ] `app/components/PageLayout.tsx` exists with a named export `PageLayout`
- [ ] Props: `pathname: string`, `children: React.ReactNode`, `description?: string`
- [ ] Renders outer `<div className="font-sans min-h-screen p-8 sm:p-20 space-y-16">`
- [ ] Contains `<Header pathname={pathname} />` at the top
- [ ] Contains `<main className="max-w-2xl mx-auto space-y-12">{children}</main>`
- [ ] Contains `<Footer />` at the bottom
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-002: Build the /now sub-page

**Description:** As a user, I want a dedicated `/now` page showing all current status items with timestamps so I can see Shunyu Yao's latest activities.

**Acceptance Criteria:**
- [ ] `app/now/page.tsx` exists with a default export
- [ ] Reads from `content/now.json`
- [ ] Displays all items as a list with bullet points
- [ ] Shows `updatedAt` formatted as "上次更新：{date}" / "Last updated: {date}"
- [ ] Uses `PageLayout` with `pathname="/now"`
- [ ] Page `<title>` is set to `Now | Shunyu Yao` (via Next.js `metadata` export)
- [ ] Typecheck passes, lint passes

### US-003: Build the /work sub-page and /work/[id] detail page

**Description:** As a user, I want to see all work experience at `/work` and click into a project to see full details.

**Acceptance Criteria:**
- [ ] `app/work/page.tsx` exists, lists all items from `content/work.json`
- [ ] Each work item shows: name, org, period, role, description (localized), highlights as bullet list, external links
- [ ] `app/work/[id]/page.tsx` exists with dynamic routing
- [ ] Detail page shows: title, org, period, role, full description, all highlights, all links, related papers (by cross-referencing paper IDs if any)
- [ ] Detail page has a `← Back to /work` link
- [ ] `generateStaticParams` is implemented for `[id]` route (required for static export)
- [ ] Both pages use `PageLayout` with correct `pathname`
- [ ] Page `<title>` set correctly (e.g. `OneStory | Work | Shunyu Yao`)
- [ ] Typecheck passes, lint passes

### US-004: Build the /papers sub-page

**Description:** As a user, I want to see all of Shunyu Yao's papers at `/papers` organized by year so I can evaluate his research output.

**Acceptance Criteria:**
- [ ] `app/papers/page.tsx` exists
- [ ] Papers sorted by `year` descending, grouped by year with year heading
- [ ] Each paper shows: full title (not truncated), authors list with "Shunyu Yao" in `<strong>`, venue in accent color, all links (paper/code) as `[paper]` `[code]` links
- [ ] Corresponding author indicated with `*` in author list
- [ ] Uses `PageLayout` with `pathname="/papers"`
- [ ] Page `<title>` set to `Papers | Shunyu Yao`
- [ ] All paper links have `relative z-10` and `target="_blank"`
- [ ] Typecheck passes, lint passes

### US-005: Build the /press sub-page

**Description:** As a user, I want to see all media appearances and press mentions at `/press`.

**Acceptance Criteria:**
- [ ] `app/press/page.tsx` exists
- [ ] Lists all items from `content/press.json`
- [ ] Each item shows: title (as external link), outlet, date, type badge (video/article)
- [ ] Uses `PageLayout` with `pathname="/press"`
- [ ] Page `<title>` set to `Press | Shunyu Yao`
- [ ] Typecheck passes, lint passes

### US-006: Build the /awards sub-page

**Description:** As a user, I want to see all awards at `/awards` so I can quickly assess Shunyu Yao's recognition.

**Acceptance Criteria:**
- [ ] `app/awards/page.tsx` exists
- [ ] Lists all items from `content/awards.json`, sorted by `year` descending
- [ ] Each award shows: year, title (localized), org
- [ ] Uses `PageLayout` with `pathname="/awards"`
- [ ] Page `<title>` set to `Awards | Shunyu Yao`
- [ ] Typecheck passes, lint passes

### US-007: Build the /about page

**Description:** As a user, I want to see Shunyu Yao's bio, education history, and contact info at `/about`.

**Acceptance Criteria:**
- [ ] `app/about/page.tsx` exists
- [ ] Shows avatar image (`public/images/avatar.jpg` or a placeholder if image doesn't exist yet — use `next/image` with `width={120} height={120} className="rounded-full"`)
- [ ] Shows name: "Shunyu Yao · 姚顺宇", tagline: "AIGC Researcher & Product Builder · Shanghai"
- [ ] About bio section (2–3 sentences, hardcoded in English and Chinese)
- [ ] Education section:
  - 2020–2024  上海交通大学  信息与通信工程博士（肄业）
  - 2017–2020  上海交通大学  仪器科学与工程硕士
  - 2012–2016  西安交通大学  机械工程及自动化学士
- [ ] Contact section: email `ysy2017@sjtu.edu.cn`, link to OneStory
- [ ] Link to `/awards` at the bottom
- [ ] Uses `PageLayout` with `pathname="/about"`
- [ ] Page `<title>` set to `About | Shunyu Yao`
- [ ] Typecheck passes, lint passes

### US-008: Verify all sub-pages and build

**Description:** As a developer, I need to confirm all sub-pages work and the static build succeeds.

**Acceptance Criteria:**
- [ ] All routes respond correctly: `/now`, `/work`, `/work/onestory`, `/work/voka`, `/papers`, `/press`, `/awards`, `/about`
- [ ] Breadcrumbs show correctly in the header for each sub-page
- [ ] All pages have correct `<title>` tags in the format `PageName | Shunyu Yao`
- [ ] `generateStaticParams` is implemented for all dynamic routes
- [ ] `npm run build` succeeds (no 404s, no TypeScript errors)
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

---

## Functional Requirements

- FR-1: All sub-pages use `PageLayout` for consistent header/footer/layout
- FR-2: Dynamic route `/work/[id]` must implement `generateStaticParams` for static export compatibility
- FR-3: `/papers` groups papers by year, descending, with author "Shunyu Yao" highlighted in `<strong>`
- FR-4: All external links on sub-pages have `relative z-10`, `target="_blank"`, `rel="noopener noreferrer"`
- FR-5: All sub-pages export `metadata` with correct `title` (format: `PageName | Shunyu Yao`)
- FR-6: Avatar image on `/about` uses `next/image`; if no real photo exists yet, use a placeholder

## Route Structure

```
app/
├── page.tsx                  ← homepage
├── now/
│   └── page.tsx              ← /now
├── work/
│   ├── page.tsx              ← /work (all experience)
│   └── [id]/
│       └── page.tsx          ← /work/onestory
├── papers/
│   └── page.tsx              ← /papers (all papers)
├── press/
│   └── page.tsx              ← /press
├── awards/
│   └── page.tsx              ← /awards
└── about/
    └── page.tsx              ← /about
```

## Non-Goals

- No internationalized URLs yet (Module 7 handles `/zh/papers` etc.)
- No pagination on any sub-page — show all items
- No comment system, no likes/reactions
- No MDX blog posts in this module

## Success Metrics

- All 7 sub-pages render without errors
- `generateStaticParams` correctly generates all dynamic routes
- Papers page shows year grouping with author highlight
- About page shows education timeline
- `npm run build` produces a successful static export
