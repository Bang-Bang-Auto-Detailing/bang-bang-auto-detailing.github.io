# Feature: Refactor Standalone Pages to Use Default Layout

## Scope Correction

Initial assessment assumed all 8 pages (index + 6 service pages + services index) bypassed the layout. After investigation, **only 2 pages** have this problem:

- `pages/index.liquid` (1,534 lines) — full HTML document with inline header
- `pages/services/index.liquid` (272 lines) — full HTML document, uses header include

The 6 individual service pages, plus about-us, contact-us, see-our-work, and 404 **already use `layout: default`**.

## Requirements

### User Story 1: Homepage Uses Default Layout
**As a** developer maintaining this site,
**I want** `pages/index.liquid` to use the default layout,
**So that** site-wide changes (SEO meta, analytics, header, footer, scripts) only need to happen in one place.

**Acceptance Criteria (EARS format):**
1. **When** the homepage is built, **the system shall** use `_layouts/default.liquid` for the HTML shell (head, body wrapper, footer scripts)
2. **When** the homepage is rendered, **the system shall** produce visually identical output to the current version (same CSS classes, same body structure, same content)
3. **When** the homepage is built, **the system shall** inherit the shared header from `_includes/header.liquid` instead of its own inline copy

### User Story 2: Services Index Uses Default Layout
**As a** developer maintaining this site,
**I want** `pages/services/index.liquid` to use the default layout,
**So that** it stays consistent with the other 6 service pages that already use `layout: default`.

**Acceptance Criteria (EARS format):**
1. **When** the services index is built, **the system shall** use `_layouts/default.liquid` for the HTML shell
2. **When** the services index is rendered, **the system shall** produce visually identical output
3. **When** the services index is built, **the system shall** include all CSS/JS that it currently loads

### Key Differences to Reconcile

**`index.liquid` vs `default.liquid` layout:**

| Concern | `index.liquid` (current) | `default.liquid` (layout) |
|---------|------------------------|--------------------------|
| Header | Inline copy (hardcoded `dmNavItemSelected` on Home) | Uses `{% include "header.liquid" %}` with dynamic active class |
| Logo | `bangbanglogo-173w.png` at 144x94 | `bangbanglogo-1920w.png` at 32x9 |
| Body class | `dm-layout-home` | `dm-layout-sec` |
| Content wrapper | `u_dmStyle_template_home` | `u_dmStyle_template_dmPageNotFound` |
| OG meta | Has `og:type` and `og:url` | Missing `og:type` and `og:url` |
| Structured data | None in head | 5 JSON-LD blocks |
| Google Fonts | Loaded in body (bottom) | Loaded in head |
| Page-specific CSS | `d9511e89_home_withFlex_1.min.css` + external CDN CSS | Not present |
| Mapbox | Loaded (for map widget) | Loaded |

**`services/index.liquid` vs `default.liquid` layout:**

| Concern | `services/index.liquid` (current) | `default.liquid` (layout) |
|---------|----------------------------------|--------------------------|
| Header | Uses `{% include "header.liquid" %}` | Same |
| Body class | `dm-layout-sec` (same as layout) | Same |
| accordion.css | Not loaded | Loaded |
| Structured data | None | 5 JSON-LD blocks |
| Google Fonts | Loaded in body (bottom) | Loaded in head |
| Page-specific CSS | `d9511e89_home_withFlex_1.min.css` | Not present |

### Layout Updates Required

The `default.liquid` layout needs updates to support these pages:
1. Add `og:type` and `og:url` meta tags
2. Make body class configurable via front matter (for `dm-layout-home` vs `dm-layout-sec`)
3. Make content wrapper class configurable via front matter
4. Support page-specific CSS via front matter
5. Fix the content wrapper class from `u_dmStyle_template_dmPageNotFound` to a proper generic class

### Success Metrics
- Both pages render identically after refactor (visual diff)
- `npm run build` succeeds without errors
- Only 2 files contain full HTML documents after refactor: `_layouts/default.liquid` and `pages/404.html`
- Header/footer/analytics changes now propagate to all pages automatically

### Specialist Agents Needed
- [x] `/frontend-developer` — Extract content from HTML shells, update front matter
- [x] `/code-reviewer` — Verify no content or functionality lost in refactor

---
**Status**: Draft — awaiting approval
