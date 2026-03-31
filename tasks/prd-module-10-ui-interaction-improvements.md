# PRD: UI Interaction Improvements

## Introduction

This module addresses UI interaction improvements for the personal website based on design feedback. Three areas are covered: (1) hover effects on content block cards on desktop, (2) mobile touch interaction for content blocks, and (3) text overflow fade effect. A fourth item updates the site name displayed on hover.

---

## Reference

- Reference site: https://anandchowdhary.com/ (source: https://github.com/AnandChowdhary/anandchowdhary.com)
- Current site: https://shunyuyao.github.io/ (source: /Users/shunyu/Documents/projects/shunyuyao.github.io)

---

## User Stories

### US-001: Add hover highlight effect to content block cards on desktop

**Description:** As a visitor on desktop, I want to see a visual highlight/border box effect when I hover over a content sub-block (e.g., "events", "writing", etc.) so that the site feels interactive and polished.

**Acceptance Criteria:**
- [ ] When the mouse hovers over a content sub-block card on desktop, a visible highlight effect (border or background box) appears — matching the style of the reference site anandchowdhary.com
- [ ] The effect is smooth (CSS transition)
- [ ] The effect disappears when the mouse leaves the card
- [ ] Typecheck passes (npx tsc --noEmit)
- [ ] Lint passes (npm run lint)
- [ ] Build succeeds (npm run build)

---

### US-002: Mobile touch — navigate directly without "See All" button

**Description:** As a visitor on mobile, I want tapping anywhere on a content block card to navigate directly into that block's detail page, without needing to tap a "See All" button, because mobile has no hover concept.

**Acceptance Criteria:**
- [ ] On mobile (touch devices), tapping anywhere on a content block card navigates to the block's detail page directly
- [ ] The "See All" button / label is hidden on mobile viewports
- [ ] No hover-triggered overlay or "See All" prompt appears on mobile
- [ ] Desktop behavior (hover to reveal "See All" or navigate) is unchanged
- [ ] Typecheck passes (npx tsc --noEmit)
- [ ] Lint passes (npm run lint)
- [ ] Build succeeds (npm run build)

---

### US-003: Text overflow fade-out effect instead of ellipsis

**Description:** As a visitor, I want long text in content cards to fade out gracefully at the edge instead of being cut off with "...", because the fade effect looks more polished.

**Acceptance Criteria:**
- [ ] When text in a content block card is too long to fit, it fades out with a gradient (transparent toward the cut edge) instead of showing an ellipsis (text-overflow: ellipsis)
- [ ] The fade matches the card background color
- [ ] The fade effect works in both light and dark modes (current site uses dark theme only: background #0a0a0a)
- [ ] Typecheck passes (npx tsc --noEmit)
- [ ] Lint passes (npm run lint)
- [ ] Build succeeds (npm run build)

---

### US-004: Update hover name to English

**Description:** As a visitor, I want the site author name shown on hover to display in English ("Yao Shunyu") instead of Chinese ("姚顺宇").

**Acceptance Criteria:**
- [ ] The name displayed on hover (in the header or logo area) reads "Yao Shunyu" instead of "姚顺宇"
- [ ] No other display name instances are unintentionally changed (review carefully)
- [ ] Typecheck passes (npx tsc --noEmit)
- [ ] Lint passes (npm run lint)
- [ ] Build succeeds (npm run build)
