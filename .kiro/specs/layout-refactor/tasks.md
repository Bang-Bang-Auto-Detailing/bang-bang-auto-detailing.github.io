# Tasks: Refactor Standalone Pages to Use Default Layout

## Phase 1: Layout Foundation

- [x] **Task 1**: Update `default.liquid` to support configurable front matter
  - **Agent**: `/frontend-developer`
  - **Deliverable**: Layout accepts `body_class`, `content_class`, `extra_css` front matter variables with backwards-compatible defaults. Adds `og:type` and `og:url` meta tags.
  - **Est. time**: 30 min

- [x] **Task 2**: Build baseline — run `npm run build` and snapshot current output for services/index and index pages
  - **Agent**: `/frontend-developer`
  - **Deliverable**: Baseline HTML captured for comparison
  - **Est. time**: 15 min

## Phase 2: Page Conversions

- [x] **Task 3**: Convert `pages/services/index.liquid` to use default layout
  - **Agent**: `/frontend-developer`
  - **Deliverable**: Page uses `layout: default`, HTML shell removed, renders identically
  - **Est. time**: 30 min

- [x] **Task 4**: Convert `pages/index.liquid` to use default layout
  - **Agent**: `/frontend-developer`
  - **Deliverable**: Page uses `layout: default`, inline header removed, HTML shell removed, homepage-specific classes set via front matter
  - **Est. time**: 45 min

## Phase 3: Verification

- [x] **Task 5**: Build and compare output, verify all pages render correctly
  - **Agent**: `/code-reviewer`
  - **Deliverable**: `npm run build` succeeds, no regressions across all pages
  - **Est. time**: 15 min

---
**Status**: Draft — awaiting approval
