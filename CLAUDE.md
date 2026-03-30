# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website for Shunyu Yao, deployed at https://shunyuyao.github.io. Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4. Statically exported to GitHub Pages.

## Commands

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Build static site to `out/`
- `npm run lint` — Run Next.js linter
- `npx tsc --noEmit` — Type-check without emitting

No test framework is configured yet.

## Architecture

### Static Export

`next.config.ts` sets `output: "export"` with `trailingSlash: true` and `unoptimized` images. The build produces an `out/` directory deployed via GitHub Actions (`peaceiris/actions-gh-pages@v4`) to the gh-pages branch.

### Styling: Tailwind CSS v4

- Uses `@import "tailwindcss"` in `globals.css` (not `@tailwind` directives)
- PostCSS plugin is `@tailwindcss/postcss` (not the old `tailwindcss` plugin)
- Design tokens are CSS custom properties in `:root`, referenced by Tailwind theme via `var(--name)` in `tailwind.config.ts`
- Dark theme only: background `#0a0a0a`, foreground `#ededed`, accent `#e8d5c4`

### Fonts

Loaded via `next/font/google` with `variable` option in `layout.tsx`, applied as CSS classes on `<html>`. The CSS `--font-sans` and `--font-mono` variables include Chinese system font fallbacks (PingFang SC, Noto Sans CJK SC, Microsoft YaHei).

### Viewport

Exported as a separate `export const viewport: Viewport` in `layout.tsx` (not inside `metadata`). This is a Next.js 15 requirement.

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).

## Conventions

- Components in `app/components/` use **named exports** (not default exports)
- Content data lives in `content/` as JSON files (work, papers, awards, press)
- Utilities and hooks go in `lib/`
- Static assets in `public/images/`

## Ralph Agent System

`scripts/ralph/` contains an autonomous agent workflow. `prd.json` defines user stories; `progress.txt` tracks completed work and codebase patterns. See `scripts/ralph/CLAUDE.md` for agent instructions.
