# PRD: Module 1 — Project Initialization & Base Architecture

## Introduction

Set up the Next.js 15 project skeleton for shunyuyao.github.io, replacing the current plain HTML+CSS static site. This module establishes the foundational architecture — build tooling, styling system, font loading, layout scaffolding, content data structure, and CI/CD pipeline — that all subsequent modules will build upon.

## Goals

- Bootstrap a Next.js 15 App Router project with TypeScript and Tailwind CSS v4
- Configure static export (`output: "export"`) for GitHub Pages deployment
- Establish the design token system (CSS custom properties) for dark-theme-only styling
- Set up font loading (Inter + Geist Mono) with Chinese system font fallbacks
- Create placeholder layout components (Container, Header, Footer)
- Scaffold empty content data files (work, papers, awards, press)
- Automate deployment via GitHub Actions on push to main

## User Stories

### US-001: Initialize Next.js 15 project with TypeScript
**Description:** As a developer, I want a Next.js 15 App Router project with TypeScript so that I have a modern, type-safe foundation.

**Acceptance Criteria:**
- [ ] `package.json` includes `next@15`, `react@19`, `react-dom@19`, `typescript`
- [ ] `tsconfig.json` exists with `@/*` path alias mapping to project root
- [ ] `next.config.ts` sets `output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`
- [ ] `npm run dev` starts the dev server on port 3000 without errors
- [ ] `npm run build` produces an `out/` directory
- [ ] `npx tsc --noEmit` passes with no type errors

### US-002: Configure Tailwind CSS v4 with design tokens
**Description:** As a developer, I want Tailwind CSS v4 configured with project design tokens so that styling is consistent and maintainable.

**Acceptance Criteria:**
- [ ] `tailwind.config.ts` exists and references CSS custom properties for theme values
- [ ] PostCSS config uses `@tailwindcss/postcss` plugin (not legacy `tailwindcss` plugin)
- [ ] `app/globals.css` uses `@import "tailwindcss"` (not `@tailwind` directives)
- [ ] `:root` in `globals.css` defines these CSS custom properties:
  - `--background: #0a0a0a`
  - `--foreground: #ededed`
  - `--muted: #737373`
  - `--border: #1f1f1f`
  - `--card: #111111`
  - `--accent: #e8d5c4`
  - `--font-sans` and `--font-mono` with full fallback stacks
- [ ] Tailwind utility classes using these tokens compile correctly
- [ ] `npx tsc --noEmit` passes

### US-003: Set up font loading with Chinese fallbacks
**Description:** As a developer, I want Inter and Geist Mono loaded via `next/font/google` with Chinese system font fallbacks so that text renders correctly for both English and Chinese content.

**Acceptance Criteria:**
- [ ] Inter loaded via `next/font/google` with `variable: "--font-inter"` (or similar CSS variable)
- [ ] Geist Mono loaded via `next/font/google` with `variable: "--font-geist-mono"` (or similar CSS variable)
- [ ] Font CSS variables applied as classes on the `<html>` element in `layout.tsx`
- [ ] `--font-sans` fallback stack includes: `-apple-system`, `"PingFang SC"`, `"Noto Sans CJK SC"`, `"Microsoft YaHei"`, `sans-serif`
- [ ] `--font-mono` fallback stack includes: `"Fira Code"`, `monospace`
- [ ] `npx tsc --noEmit` passes

### US-004: Create root layout and empty home page
**Description:** As a developer, I want a root layout with global styles and an empty home page so that the app renders a dark-themed blank page.

**Acceptance Criteria:**
- [ ] `app/layout.tsx` imports `globals.css`, sets `<html lang="en">`, applies font variable classes
- [ ] `export const metadata` includes basic title and description
- [ ] `export const viewport: Viewport` is exported separately (Next.js 15 requirement — not inside `metadata`)
- [ ] `app/page.tsx` renders a minimal page (can be empty or contain a placeholder)
- [ ] Visiting `localhost:3000` shows a dark page with background `#0a0a0a`
- [ ] `npx tsc --noEmit` passes
- [ ] Verify in browser using dev-browser skill

### US-005: Create layout components (Container, Header, Footer)
**Description:** As a developer, I want reusable layout shell components so that subsequent modules can compose pages consistently.

**Acceptance Criteria:**
- [ ] `app/components/container.tsx` exports a named `Container` component that wraps children with max-width and horizontal padding
- [ ] `app/components/header.tsx` exports a named `Header` component (can be a minimal placeholder)
- [ ] `app/components/footer.tsx` exports a named `Footer` component (can be a minimal placeholder)
- [ ] All components use **named exports** (not default exports)
- [ ] Components accept `children` or relevant props with proper TypeScript types
- [ ] `npx tsc --noEmit` passes

### US-006: Scaffold content data files
**Description:** As a developer, I want empty JSON data files in `content/` so that future modules have a defined schema location for content.

**Acceptance Criteria:**
- [ ] `content/work.json` exists with an empty array `[]`
- [ ] `content/papers.json` exists with an empty array `[]`
- [ ] `content/awards.json` exists with an empty array `[]`
- [ ] `content/press.json` exists with an empty array `[]`
- [ ] Directory `lib/hooks/` exists (empty, for future use)
- [ ] Directory `public/images/` exists (empty or with `.gitkeep`)

### US-007: Create content data file scaffolding
**Description:** As a developer, I want TypeScript type definitions for each content type so that content data is type-safe when consumed by components.

**Acceptance Criteria:**
- [ ] Type definitions exist for Work, Paper, Award, and Press content types
- [ ] Types are importable from a known location (e.g., `lib/types.ts` or `content/types.ts`)
- [ ] Types match the expected shape of data in each JSON file
- [ ] `npx tsc --noEmit` passes

### US-008: Set up GitHub Actions deployment workflow
**Description:** As a developer, I want an automated CI/CD pipeline so that pushing to main deploys the site to GitHub Pages.

**Acceptance Criteria:**
- [ ] `.github/workflows/deploy.yml` exists
- [ ] Workflow triggers on push to `main` branch
- [ ] Uses Node.js 20
- [ ] Runs `npm ci` then `npm run build`
- [ ] Uses `peaceiris/actions-gh-pages@v4` to publish the `./out` directory
- [ ] Workflow YAML is valid (passes `actionlint` or manual review)

## Functional Requirements

- FR-1: The project must use Next.js 15 with App Router (not Pages Router)
- FR-2: TypeScript must be enabled with strict mode and `@/*` path alias
- FR-3: Static export must be configured (`output: "export"`) producing an `out/` directory
- FR-4: `trailingSlash: true` must be set in `next.config.ts` for GitHub Pages compatibility
- FR-5: Images must be unoptimized (`images: { unoptimized: true }`) since there is no image optimization server in static export
- FR-6: Tailwind CSS v4 must be configured using `@tailwindcss/postcss` and `@import "tailwindcss"` syntax
- FR-7: All six design tokens (`--background`, `--foreground`, `--muted`, `--border`, `--card`, `--accent`) must be defined as CSS custom properties in `:root`
- FR-8: Inter and Geist Mono must be loaded via `next/font/google` with CSS variable injection
- FR-9: Font fallback stacks must include Chinese system fonts (PingFang SC, Noto Sans CJK SC, Microsoft YaHei)
- FR-10: The `viewport` export must be separate from `metadata` in `layout.tsx` (Next.js 15 requirement)
- FR-11: All components in `app/components/` must use named exports
- FR-12: Content JSON files must exist at `content/{work,papers,awards,press}.json`
- FR-13: GitHub Actions workflow must deploy `./out` to `gh-pages` branch on push to `main`

## Non-Goals

- No page content, copy, or real data — only scaffolding and placeholders
- No responsive design implementation (handled in later modules)
- No navigation routing between pages (single page only for now)
- No SEO optimization beyond basic metadata
- No analytics or tracking integration
- No dark/light theme toggle — dark theme only
- No testing framework setup in this module
- No image assets or media files

## Technical Considerations

- **Next.js 15 + React 19**: Ensure all dependencies are compatible with React 19 (some ecosystem packages may need updates)
- **Tailwind CSS v4 breaking changes**: v4 uses `@import "tailwindcss"` instead of `@tailwind` directives, and `@tailwindcss/postcss` instead of the `tailwindcss` PostCSS plugin — do not use v3 patterns
- **Static export limitations**: No API routes, no server-side rendering, no `getServerSideProps` — all pages must be statically exportable
- **GitHub Pages base path**: Since this deploys to `username.github.io` (not a subpath), no `basePath` configuration is needed
- **Viewport export**: Next.js 15 requires `viewport` to be exported separately from `metadata` — mixing them causes a build warning/error

## Success Metrics

- `npm run dev` starts without errors
- `npm run build` completes successfully and generates `out/` directory
- `npx tsc --noEmit` passes with zero errors
- `npm run lint` passes with zero errors
- `localhost:3000` renders a dark page (background `#0a0a0a`, foreground `#ededed`)
- GitHub Actions workflow runs successfully on push to main
- Lighthouse Performance score > 90 on the empty page

## Open Questions

- None — all technical decisions are defined in the spec.
