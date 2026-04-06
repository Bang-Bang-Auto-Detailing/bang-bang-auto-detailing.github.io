# Design: Refactor Standalone Pages to Use Default Layout

## Architecture Overview

Two standalone pages need to be converted to use `_layouts/default.liquid`. The layout must be updated to support page-specific configuration via front matter variables, then each page's HTML shell is stripped, leaving only the content body.

## Approach

### Strategy: Update layout first, then convert pages one at a time

This avoids breaking existing pages that already use the layout. The layout changes add optional front matter variables with sensible defaults, so existing pages are unaffected.

## Components

### Component 1: Update `default.liquid` Layout
- **Purpose**: Make the layout flexible enough to support both inner pages and the homepage
- **Agent**: `/frontend-developer`
- **Files**:
  - Modify: `_layouts/default.liquid`

**Changes:**

1. **Add `og:type` and `og:url` meta tags** (currently missing from layout):
   ```liquid
   <meta property="og:type" content="website" />
   <meta property="og:url" content="https://www.bangbangautodetailing.com{{ page.url }}" />
   ```

2. **Make body class configurable** via `body_class` front matter variable:
   ```liquid
   <!-- Current: hardcoded dm-layout-sec -->
   <div ... class="... dm-layout-sec ...">
   <!-- New: configurable with default -->
   <div ... class="... {{ body_class | default: 'dm-layout-sec' }} ...">
   ```

3. **Make content wrapper class configurable** via `content_class` front matter:
   ```liquid
   <!-- Current: hardcoded u_dmStyle_template_dmPageNotFound -->
   <div ... class="dmBody u_dmStyle_template_dmPageNotFound">
   <!-- New: configurable with default -->
   <div ... class="dmBody {{ content_class | default: 'u_dmStyle_template_dmPageNotFound' }}">
   ```

4. **Add page-specific CSS support** via `extra_css` front matter (array of paths):
   ```liquid
   {% for css in extra_css %}
   <link rel="stylesheet" href="{{ css }}" />
   {% endfor %}
   ```
   Place after the existing CSS links in the head.

5. **Fix the `d9511e89_1.min.css` reference**: Currently the layout loads this but both standalone pages load `d9511e89_withFlex_1.min.css` instead. Verify which is correct by checking other pages that use the layout.

### Component 2: Convert `pages/services/index.liquid`
- **Purpose**: Simpler of the two pages — already uses `{% include "header.liquid" %}`, just needs HTML shell removed
- **Agent**: `/frontend-developer`
- **Files**:
  - Modify: `pages/services/index.liquid`

**Changes:**
1. Add front matter: `layout: default`, `title`, `description`
2. Strip everything outside the content div (lines 1-56 and 242-272)
3. Keep only the inner content (the `<div dm:templateorder="170" ...>` block)
4. Add `extra_css` in front matter for page-specific CSS if needed

### Component 3: Convert `pages/index.liquid`
- **Purpose**: Largest page — needs inline header removed, HTML shell stripped
- **Agent**: `/frontend-developer`
- **Files**:
  - Modify: `pages/index.liquid`

**Changes:**
1. Add front matter: `layout: default`, `title`, `description`, `body_class: dm-layout-home`, `content_class: u_dmStyle_template_home`
2. Strip the `<head>` section (lines 5-45)
3. Strip the body/wrapper opening tags (lines 47-56)
4. Strip the inline header (lines 57-250) — replaced by layout's `{% include "header.liquid" %}`
5. Strip the footer/message-us includes (already in layout)
6. Strip the closing wrapper tags and bottom CSS/JS block (lines 1502-1534)
7. Keep only the content between the `dmContent` div — the actual page sections
8. Add `extra_css` for homepage-specific CSS: `d9511e89_home_withFlex_1.min.css`

### Component 4: Verify header.liquid handles homepage correctly
- **Purpose**: Ensure the shared header works properly on the homepage
- **Agent**: `/frontend-developer`
- **Files**:
  - Review: `_includes/header.liquid`

**Key concern:** The inline header in index.liquid uses `data-overlapping` attribute missing from the include version, and has hardcoded `dmNavItemSelected` classes. The header include already has `{% if page.url == '/' %} active-menu{% endif %}` logic, so this should work correctly. Verify the `data-overlapping="true"` attribute exists in header.liquid (it does, on line 2).

## Files Changed Summary

| File | Action | Risk |
|------|--------|------|
| `_layouts/default.liquid` | Modify (add front matter variables) | Low — defaults preserve existing behavior |
| `pages/services/index.liquid` | Modify (strip HTML shell, add front matter) | Medium — visual diff needed |
| `pages/index.liquid` | Modify (strip HTML shell + inline header, add front matter) | High — largest change, most content |

## Testing Strategy
- Run `npm run build` after each file change to verify no build errors
- Compare built HTML output before/after for each converted page
- Visual inspection of homepage and services index in browser
- Verify all CSS/JS assets still load correctly

---
**Status**: Draft — awaiting approval
