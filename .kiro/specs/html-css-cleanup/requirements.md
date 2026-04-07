# Feature: Strip Site Builder Bloat from HTML/CSS

## Problem
The site was exported from DudaMobile and carries ~420KB+ of unnecessary CSS, 4,000+ unused data attributes, 600+ decorative inline styles, 96 empty wrapper divs, and a 307KB JS file loaded incorrectly as CSS.

## Audit Findings

### CSS Files (loaded in default.liquid)
| File | Size | Status |
|------|------|--------|
| `merge.css` | 537K | Keep — widget-specific styles (u_XXXXX classes) |
| `style.css` | 5.2K | Keep — custom site CSS |
| `accordion.css` | 4.7K | Keep — accordion widget |
| `d-css-runtime-flex.min.css` | 178K | Keep — flex layout system |
| `ed546b3a09337ff6f44214a612a1eb20.css` | 25K | Keep — widget/social/gallery styles |
| `3ae23524f151e31dcd0c91853124653d.css` | 100K | Keep — additional widget styles |
| `d9511e89_1.min.css` | 49K | **REMOVE** — 100% duplicated in home CSS |
| `d9511e89_withFlex_1.min.css` | 64K | **REMOVE** — never loaded, superset exists |
| `d9511e89_home_withFlex_1.min.css` | 75K | **PROMOTE** — move to layout (superset of both removed files) |

### HTML Bloat
| Type | Count | Action |
|------|-------|--------|
| Unused `data-*` attributes | 4,000+ | Strip all except `data-flex-site`, `data-origin`, `data-push-content` |
| Inline `style=""` with framer vars | 240+ | Remove (vars undefined, only fallbacks render) |
| Decorative `style="display: initial"` | 100+ | Remove (initial is the default) |
| Empty `<div class="flex-widgets-container">` | 96 | Remove |
| `onerror="handleImageLoadError(this)"` | 44 | Remove (function doesn't exist) |

### JavaScript Issues
| Issue | Action |
|-------|--------|
| `d-js-runtime-flex-package.min.js` (307K) loaded as `<link rel="stylesheet">` | Fix to `<script>` or remove if nonfunctional |
| Mapbox API key hardcoded in `script.js` | Move to Eleventy global data |

## Success Metrics
- Build succeeds with identical visual output (Playwright screenshots before/after)
- CSS payload reduced by ~113K (removing duplicate files)
- HTML significantly lighter (thousands fewer attributes/elements)
- No JS console errors

## Specialist Agents
- [x] `/ux-architect` — CSS file analysis and consolidation strategy
- [x] `/frontend-developer` — HTML template cleanup, JS fixes
- [x] `/performance-benchmarker` — before/after payload measurement
- [x] `/code-reviewer` — visual regression verification via Playwright

---
**Status**: Draft — awaiting approval
