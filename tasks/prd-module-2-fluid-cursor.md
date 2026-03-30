# PRD: Fluid Cursor Effect

## Introduction

Add a WebGL-based fluid cursor effect (rainbow smoke/fluid animation) to shunyuyao.github.io. This is the primary visual signature of the site — when the user moves their mouse or touches the screen, colorful fluid smoke appears overlaid on all content. The effect is purely decorative and must not interfere with page interactivity.

The WebGL fluid simulation is sourced from Lorenzo Maiuri's open-source website ([useFluidCursor.ts](https://github.com/lorenzomaiuri-dev/lorenzo-maiuri-website/blob/main/lib/hooks/useFluidCursor.ts)) and adapted with custom configuration for rainbow colors, transparent overlay, and mobile performance optimization.

## Goals

- Deliver a visually striking rainbow fluid smoke effect that follows the cursor across the entire page
- Support both mouse (desktop) and touch (mobile) interactions
- Lazy-load the WebGL context so it has zero impact on initial page load performance
- Ensure the fluid canvas never blocks clicks on links, buttons, or other interactive elements
- Degrade gracefully on mobile devices by reducing simulation resolution

## User Stories

### US-001: Copy and configure the WebGL fluid simulation hook
**Description:** As a developer, I need the fluid simulation engine in the codebase so that other components can invoke it to render the effect.

**Acceptance Criteria:**
- [ ] `lib/hooks/useFluidCursor.ts` exists, copied from [Lorenzo Maiuri's repo](https://github.com/lorenzomaiuri-dev/lorenzo-maiuri-website/blob/main/lib/hooks/useFluidCursor.ts)
- [ ] Config params are set: `TRANSPARENT: true`, `DENSITY_DISSIPATION: 3.5`, `VELOCITY_DISSIPATION: 2`, `COLOR_UPDATE_SPEED: 10`, `SPLAT_RADIUS: 0.2`, `SPLAT_FORCE: 6000`
- [ ] Mobile performance degradation is added near the top of the hook: on touch devices (`pointer: coarse`), set `SIM_RESOLUTION: 64` and `DYE_RESOLUTION: 720`
- [ ] The hook targets a canvas element with `id="fluid"`
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-002: Create the FluidCursor component
**Description:** As a developer, I need a component that renders the full-screen canvas and initializes the WebGL simulation so the fluid effect is displayed.

**Acceptance Criteria:**
- [ ] `app/components/FluidCursor.tsx` exists as a `"use client"` component with a default export
- [ ] Component renders a `<div className="fixed inset-0 z-[2] pointer-events-none">` containing a `<canvas id="fluid">` with `pointer-events: none`
- [ ] Component calls `fluidCursor()` via `useEffect` on mount
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-003: Create the FluidCursorWrapper lazy-loading component
**Description:** As a user, I want the fluid effect to only initialize after I first interact with the page so that initial page load is fast.

**Acceptance Criteria:**
- [ ] `app/components/FluidCursorWrapper.tsx` exists as a `"use client"` component with a default export
- [ ] Uses `next/dynamic` to lazy-import `FluidCursor` with `ssr: false`
- [ ] Renders nothing until the first `mousemove` or `touchstart` event fires
- [ ] After the first interaction event, renders the `LazyFluidCursor` component
- [ ] Event listeners are cleaned up on unmount and after first trigger
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-004: Mount FluidCursorWrapper in the root layout
**Description:** As a user, I want the fluid effect available on every page of the site so the visual signature is consistent.

**Acceptance Criteria:**
- [ ] `FluidCursorWrapper` is imported in `app/layout.tsx`
- [ ] `<FluidCursorWrapper />` is rendered inside `<body>` (alongside `{children}`)
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)

### US-005: Apply z-index rules to ensure clickability
**Description:** As a user, I want to be able to click all links, buttons, and interactive elements without the fluid canvas blocking them.

**Acceptance Criteria:**
- [ ] The fluid canvas sits at `z-[2]` with `pointer-events: none`
- [ ] All clickable links and buttons across the site have `z-10` or higher (above the canvas)
- [ ] Modals, toasts, and menus use `z-50` or higher
- [ ] Clicking any link or button on the page works as expected with the fluid effect active
- [ ] Typecheck passes (`npx tsc --noEmit`)
- [ ] Verify in browser using dev-browser skill

### US-006: Verify full integration and performance
**Description:** As a user, I want to see rainbow fluid smoke when I move my mouse, with no performance penalty on initial load.

**Acceptance Criteria:**
- [ ] Moving mouse anywhere on the page produces rainbow fluid smoke
- [ ] Touch on mobile also produces fluid effect
- [ ] Chrome DevTools Performance recording shows no WebGL initialization cost on first paint (WebGL only starts after first interaction)
- [ ] `npm run build` succeeds (static export works)
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: The system must render a full-screen `<canvas>` element overlaying all page content at `z-index: 2` with `pointer-events: none`
- FR-2: The canvas must run a WebGL fluid simulation that produces rainbow-colored smoke trails following the cursor
- FR-3: The fluid simulation must use a transparent background so page content is visible beneath it
- FR-4: The WebGL context must NOT be created until the user's first `mousemove` or `touchstart` event
- FR-5: On touch devices (`pointer: coarse` media query), the simulation must reduce resolution (`SIM_RESOLUTION: 64`, `DYE_RESOLUTION: 720`) for performance
- FR-6: All interactive elements (links, buttons) must remain clickable by sitting above the canvas in the z-index stacking order (`z-10` or higher)
- FR-7: The `FluidCursor` component must be dynamically imported with `ssr: false` to avoid server-side rendering of WebGL code
- FR-8: The fluid effect must use these simulation parameters: `DENSITY_DISSIPATION: 3.5`, `VELOCITY_DISSIPATION: 2`, `COLOR_UPDATE_SPEED: 10`, `SPLAT_RADIUS: 0.2`, `SPLAT_FORCE: 6000`

## Non-Goals

- No user-configurable settings or UI controls for the fluid effect
- No option to disable the effect (beyond browser-level WebGL disabling)
- No fallback animation for browsers without WebGL support
- No integration with page scroll or other non-cursor interactions
- No color theming — always rainbow

## Design Considerations

- The fluid effect is a full-viewport overlay — it does not interact with or adapt to page layout
- The canvas is purely decorative; `pointer-events: none` ensures it never captures input
- Z-index layering is critical:
  - `z-auto` / `z-1`: normal page content
  - `z-[2]`: FluidCursor canvas (`pointer-events: none`)
  - `z-10`: all clickable links and buttons
  - `z-50+`: modals, toasts, menus
- The rainbow color cycling (`COLOR_UPDATE_SPEED: 10`) creates the signature visual — do not use static or theme-matched colors

## Technical Considerations

- **Source:** The WebGL simulation hook is copied from [Lorenzo Maiuri's open-source repo](https://github.com/lorenzomaiuri-dev/lorenzo-maiuri-website/blob/main/lib/hooks/useFluidCursor.ts) — check license compatibility
- **Component structure:**
  - `lib/hooks/useFluidCursor.ts` — WebGL simulation engine (copied + configured)
  - `app/components/FluidCursor.tsx` — renders canvas, calls hook
  - `app/components/FluidCursorWrapper.tsx` — lazy-loads FluidCursor on first interaction
- **SSR safety:** `next/dynamic` with `ssr: false` prevents WebGL code from running during static export
- **Performance:** Lazy initialization means zero cost at first paint; mobile resolution reduction prevents frame drops on lower-powered devices
- **Static export:** Must work with `output: "export"` in `next.config.ts` — no server-side dependencies
- **Existing layout:** `app/layout.tsx` currently has `<body className="antialiased min-h-screen">{children}</body>` — `FluidCursorWrapper` should be added alongside `{children}`

## Success Metrics

- Rainbow fluid smoke visibly follows cursor on desktop and touch on mobile
- Zero WebGL initialization cost measured in Chrome DevTools Performance on first paint
- All existing links and buttons remain fully clickable with the effect active
- `npm run build` produces a successful static export with no errors
- No visible frame drops or jank on modern desktop browsers

## Open Questions

- What is the license of Lorenzo Maiuri's `useFluidCursor.ts`? Need to verify it permits copying.
- Should the effect be disabled on low-end devices or browsers that report `prefer-reduced-motion`?
- Should there be a way for the user to toggle the effect off (e.g., a settings toggle or keyboard shortcut)?
