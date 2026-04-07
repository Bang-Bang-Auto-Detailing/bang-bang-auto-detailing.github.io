# Tasks: Strip Site Builder Bloat

## Phase 1: CSS Consolidation

- [ ] **Task 1**: Capture baseline — Playwright screenshots + HTML/CSS sizes for all pages
  - **Agent**: `/performance-benchmarker`
  - **Deliverable**: Baseline metrics saved for comparison
  - **Est. time**: 15 min

- [ ] **Task 2**: Remove duplicate CSS files, promote home CSS to layout (PR A)
  - **Agent**: `/ux-architect`
  - **Deliverable**: 113K CSS removed, Playwright verification passes
  - **Est. time**: 30 min

- [ ] **Task 3**: Fix or remove JS file loaded as CSS (PR B)
  - **Agent**: `/ux-architect`
  - **Deliverable**: `d-js-runtime-flex-package.min.js` either fixed or removed
  - **Est. time**: 20 min

## Phase 2: HTML Template Cleanup

- [ ] **Task 4**: Remove 96 empty `flex-widgets-container` divs (PR C)
  - **Agent**: `/frontend-developer`
  - **Deliverable**: All empty wrapper divs removed, Playwright passes
  - **Est. time**: 30 min

- [ ] **Task 5**: Strip unused data-* attributes (PR D)
  - **Agent**: `/frontend-developer`
  - **Deliverable**: ~4,000 data attributes removed, Playwright passes
  - **Est. time**: 45 min

- [ ] **Task 6**: Clean up inline styles and dead onerror handlers (PR E)
  - **Agent**: `/frontend-developer`
  - **Deliverable**: ~600 inline styles cleaned, Playwright passes
  - **Est. time**: 45 min

- [ ] **Task 7**: Move Mapbox API key to Eleventy global data (PR F)
  - **Agent**: `/frontend-developer`
  - **Deliverable**: API key out of source, map still works
  - **Est. time**: 20 min

## Phase 3: Verification

- [ ] **Task 8**: Final before/after comparison (PR G)
  - **Agent**: `/code-reviewer` + `/performance-benchmarker`
  - **Deliverable**: Documented size reduction, screenshot comparison, no regressions
  - **Est. time**: 20 min

---
**Status**: Draft — awaiting approval
