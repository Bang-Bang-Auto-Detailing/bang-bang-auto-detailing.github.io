# Feature: Full HTML/CSS Rewrite

## Goal
Replace all DudaMobile export markup with clean, semantic HTML and hand-written CSS while preserving the exact visual appearance and functionality of the site.

## Current State
- 1,142KB of concatenated CSS from 8 site builder sources
- 14-15 levels of `<div>` nesting to reach content
- Proprietary class system: `dm*`, `u_*`, `flex-element`, `dmNewParagraph`, etc.
- 1,159 `!important` declarations
- 7,458 CSS rules

## Site Inventory

### Pages (12 total)
| Page | Layout Pattern | Key Content |
|------|---------------|-------------|
| Home | Hero + 6 sections | Hero, About, Services grid, Gallery, FAQ accordion, Contact + map |
| About Us | Hero + content | Hero, about text, image |
| Services Index | Hero + card grid | 6 service cards with images and CTAs |
| Ceramic Coating | Hero + content + pricing | Service detail with pricing menu + map |
| Full Exterior & Interior | Hero + content + pricing | Same pattern as ceramic coating |
| Paint & Trim | Hero + content + pricing | Same pattern |
| Vinyl Removal | Hero + content + pricing | Same pattern |
| Boats Detailing | Hero + content + pricing | Same pattern |
| RVs Detailing | Hero + content + pricing | Same pattern |
| See Our Work | Hero + gallery | Photo gallery with PhotoSwipe lightbox |
| Contact Us | Hero + form + info | Contact form, hours, map |
| 404 | Simple | Error message + home link |

### Shared Components
| Component | Current File | Function |
|-----------|-------------|----------|
| Header | `_includes/header.liquid` | Sticky nav, logo, hamburger menu, Book Online CTA |
| Footer | `_includes/footer.liquid` | Logo, service links, contact info, hours, social icons |
| Gallery | `_includes/gallery.liquid` | PhotoSwipe asymmetric photo grid |
| Message Modal | `_includes/message-us.liquid` | Popup contact form (first name, last name, phone) |

### Design System
| Token | Value | Usage |
|-------|-------|-------|
| `--color-dark` | `#2D2E32` | Body text |
| `--color-light` | `#E5E5E5` | Borders, dividers |
| `--color-white` | `#FFFFFF` | Text on dark backgrounds |
| `--color-teal` | `#032621` | Dark accent |
| `--color-pink` | `#E01882` | Primary CTA, active states |
| `--color-green` | `#6BBE4A` | Secondary accent, headings |
| Font: Raleway | 400, 700 | Headings |
| Font: Poppins | 400-700 | Body text |
| Font: Quicksand | 400-700 | Subheadings |
| Max width | 1200px | Content container |
| Breakpoints | 768px, 1024px | Tablet, desktop |

### Interactive Features
| Feature | Dependency | Pages |
|---------|-----------|-------|
| Photo gallery lightbox | PhotoSwipe 5.4.4 (CDN) | Home, See Our Work |
| Interactive map | Mapbox GL 3.13.0 (CDN) | Home, all service pages |
| Hamburger menu | Custom JS | All (mobile) |
| FAQ accordion | Custom JS | Home |
| Pricing accordion | Custom JS | Service pages |
| Contact modal | Custom JS | All |
| Analytics | Google Analytics 4 | All |

## Rewrite Principles

1. **Semantic HTML** — Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<figure>`, `<dialog>` instead of generic `<div>` nesting
2. **BEM naming** — `.hero`, `.hero__title`, `.hero__subtitle`, `.service-card`, `.service-card__image`
3. **CSS Grid + Flexbox** — Modern layout without wrapper divs
4. **Mobile-first** — Start with mobile styles, add complexity at wider breakpoints
5. **CSS custom properties** — Consistent design tokens for colors, spacing, fonts
6. **Minimal JS** — Rewrite script.js to use modern patterns (dialog element, details/summary for accordion)
7. **Zero !important** — Clean specificity hierarchy
8. **Accessible** — ARIA where needed, keyboard navigation, focus management

## Execution Plan — 8 PRs

### Phase 1: Foundation
**PR 1: New CSS foundation + design tokens**
- Create clean `style.css` with CSS reset, custom properties, utility classes, typography
- Add responsive grid system
- Keep old CSS loaded alongside during transition

**PR 2: Rewrite layout + header + footer**
- Replace `default.liquid` markup with semantic HTML
- Rewrite header: `<header>`, `<nav>`, hamburger as `<button>` + `<dialog>`
- Rewrite footer: `<footer>` with semantic sections
- Update JS for new selectors

### Phase 2: Page Templates (one Eleventy layout per pattern)
**PR 3: Create service page layout**
- New `_layouts/service.liquid` with clean markup
- Convert one service page as proof of concept
- Verify visual match with Playwright

**PR 4: Convert all service pages**
- Apply service layout to remaining 5 service pages
- Each page becomes front matter + content only (no markup)

**PR 5: Rewrite home page**
- Largest page — hero, about, services grid, gallery, FAQ, contact
- Each section as a clean `<section>` with descriptive class

**PR 6: Rewrite remaining pages**
- About Us, Contact Us, Services Index, See Our Work, 404

### Phase 3: Cleanup
**PR 7: Rewrite JS**
- Modern hamburger (dialog element or data attributes)
- Details/summary for accordions (zero JS)
- Clean PhotoSwipe/Mapbox initialization
- Remove DudaMobile runtime JS

**PR 8: Remove old CSS + final verification**
- Remove the concatenated DudaMobile CSS
- Full Playwright regression test at all widths
- Performance comparison (before/after Lighthouse)

## Specialist Agents
- [x] `/ux-architect` — Design system, CSS architecture, responsive grid
- [x] `/frontend-developer` — HTML templates, JS rewrite
- [x] `/accessibility-auditor` — Semantic HTML, ARIA, keyboard nav
- [x] `/performance-benchmarker` — Before/after metrics
- [x] `/code-reviewer` — Playwright visual regression

## Risk Mitigation
- Old CSS stays loaded until PR 8 (safety net)
- Each PR verified with Playwright screenshots
- Service page layout proven on one page before batch conversion
- JS features tested individually

---
**Status**: Draft — awaiting approval
