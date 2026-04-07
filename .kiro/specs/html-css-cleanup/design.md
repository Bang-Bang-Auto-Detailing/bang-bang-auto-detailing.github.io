# Design: Strip Site Builder Bloat

## Approach: Safe, incremental PRs with Playwright regression testing

Every PR will be verified with Playwright screenshots at 1500/1024/768/375px across homepage, services, and a service detail page before merging.

## Phase 1: CSS Consolidation (`/ux-architect`)

### PR A: Remove duplicate CSS files, promote home CSS to layout

**Problem:** Three overlapping CSS files:
- `d9511e89_1.min.css` (49K) — base styles
- `d9511e89_withFlex_1.min.css` (64K) — superset of base (never loaded)
- `d9511e89_home_withFlex_1.min.css` (75K) — superset of both

**Fix:**
1. Remove `d9511e89_1.min.css` from `default.liquid` head
2. Delete `d9511e89_withFlex_1.min.css` (never referenced)
3. Move `d9511e89_home_withFlex_1.min.css` into the layout head (replaces the base file)
4. Remove `extra_css` front matter from `index.liquid` and `services/index.liquid`

**Files modified:** `_layouts/default.liquid`, `pages/index.liquid`, `pages/services/index.liquid`
**Files deleted:** `assets/css/d9511e89_1.min.css`, `assets/css/d9511e89_withFlex_1.min.css`
**Savings:** ~113K CSS removed

### PR B: Fix JS loaded as CSS

**Problem:** `d-js-runtime-flex-package.min.js` (307K) is loaded with `<link rel="stylesheet">` — browser ignores it entirely.

**Fix:** Test removing it. If no visual change (likely, since it's been broken this whole time), remove the line. If something breaks, fix to `<script>`.

**Files modified:** `_layouts/default.liquid`

## Phase 2: HTML Template Cleanup (`/frontend-developer`)

### PR C: Remove empty wrapper divs

Remove all 96 `<div class="flex-widgets-container" id="..."></div>` elements across all templates and includes.

**Files modified:** All pages, `_includes/header.liquid`, `_includes/footer.liquid`

### PR D: Strip unused data attributes

Remove data attributes not used by JavaScript. Keep only:
- `data-flex-site` (layout initialization)
- `data-origin` (drawer position)
- `data-push-content` (drawer behavior)
- `data-pswp-width`, `data-pswp-height` (PhotoSwipe gallery)
- `data-display-type` (button rendering)

Remove: `data-auto`, `data-widget-type`, `data-external-id`, `data-element-type`, `data-version`, `data-binding`, `data-encoded-value`, `data-inline-binding`, `data-grab`, `data-diy-text`, `data-diy-image`, `data-dm-image-path`, `data-widget-version`, `data-responsive-name`, `data-page-element-type`, `data-page-element-id`, etc.

**Files modified:** All pages and includes
**Risk:** Medium — need careful Playwright verification

### PR E: Clean up inline styles

Remove:
1. `style="display: initial;"` and `style="display: unset;"` (default values, no-op)
2. Framer variable styles where only the fallback renders:
   - `font-weight: var(--framer-font-weight, 400)` → remove (400 is default)
   - `font-style: var(--framer-font-style, normal)` → remove (normal is default)
   - `letter-spacing: var(--framer-letter-spacing, 0)` → remove (0 is default)
3. `onerror="handleImageLoadError(this)"` on all `<img>` tags (function doesn't exist)

**Files modified:** All pages and includes
**Risk:** Medium — inline styles can interact with CSS specificity

### PR F: Move Mapbox key to Eleventy global data

**Problem:** API key hardcoded in `script.js`

**Fix:** Add `mapbox_key` to `.eleventy.js` global data, inject via template into a `<script>` tag before `script.js` loads.

**Files modified:** `.eleventy.js`, `_layouts/default.liquid`, `assets/js/script.js`

## Phase 3: Verification (`/code-reviewer` + `/performance-benchmarker`)

### PR G: Before/after measurement

After all PRs merged, document:
- Total CSS payload before vs after
- Total HTML size before vs after (built output)
- Playwright screenshot comparison at all widths
- Lighthouse score comparison

## Execution Order

```
PR A (CSS consolidation) → PR B (fix JS/CSS load) → PR C (empty divs)
→ PR D (data attributes) → PR E (inline styles) → PR F (mapbox key)
→ PR G (verification)
```

Each PR is independently mergeable. PRs C-E are the riskiest and need the most careful Playwright verification.

---
**Status**: Draft — awaiting approval
