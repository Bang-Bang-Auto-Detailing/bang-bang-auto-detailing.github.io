# Feature: Flatten DudaMobile Nesting Bloat

## Problem

The site builder exported HTML with 14-15 levels of nesting to reach actual content. A typical text element looks like:

```
data-layout-section div          ← removable (no styles)
  └─ section.flex-element.section  ← removable (no styles)
      └─ div.flex-element.grid     ← KEEP (display:grid via [data-layout-grid])
          └─ div.flex-element.group  ← KEEP (flex-direction:row, max-width:1200px)
              └─ div.flex-element.group  ← KEEP (flex-direction:column)
                  └─ div.flex-element.group  ← removable (redundant 3rd nesting)
                      └─ div.flex-element.widget-wrapper  ← KEEP (position:relative)
                          └─ div.dmNewParagraph  ← removable (no styles)
                              └─ p
                                  └─ span
                                      └─ span  ← removable (redundant nesting)
                                          └─ "actual text"
```

## CSS Dependency Analysis

| Wrapper | CSS Rules | Verdict |
|---------|-----------|---------|
| `div[data-layout-section]` | None | **REMOVE** |
| `section.flex-element.section` | None | **REMOVE** |
| `div.flex-element.grid[data-layout-grid]` | `display:grid; grid-template-columns/rows` | **KEEP** |
| `div.flex-element.group` (1st) | `display:flex; flex-direction:row; max-width:1200px` | **KEEP** |
| `div.flex-element.group` (2nd) | `display:flex; flex-direction:column; align-self:stretch` | **KEEP** |
| `div.flex-element.group` (3rd+) | Same rules but redundant | **REMOVE** |
| `div.flex-element.widget-wrapper` | `position:relative; min-width:10px; min-height:10px` | **KEEP** |
| `div.dmNewParagraph` | None | **REMOVE** |
| Nested `<span>` with duplicate styles | None unique | **FLATTEN** |

## Approach: Conservative, One Layer at a Time

Each removable layer gets its own PR with Playwright verification. Start with the safest (no CSS dependency) and work toward riskier ones.

### PR 1: Remove `div[data-layout-section]` wrappers
- ~96 instances across all pages
- Zero CSS or JS dependencies
- Pure wrapper with no attributes used anywhere

### PR 2: Remove `section.flex-element.section` wrappers
- ~96 instances (one per section)
- Zero direct CSS rules
- Move any ID attributes to the grid div inside

### PR 3: Remove `div.dmNewParagraph` wrappers
- ~200+ instances across all pages
- Zero CSS rules (verified in all CSS files)
- Move the `id` attribute to the content element inside

### PR 4: Flatten redundant 3rd+ `.flex-element.group` nesting
- ~100+ instances where groups nest 3+ deep
- Riskiest change — the home-specific CSS (`d9511e89_home_withFlex_1.min.css`) targets specific element IDs that are on these wrapper divs
- Must preserve element IDs while flattening structure

### PR 5: Flatten redundant `<span>` nesting
- ~100+ nested spans with identical/no styles
- `<span><span style="color:white">text</span></span>` → `<span style="color:white">text</span>`

## Specialist Agents
- [x] `/ux-architect` — CSS dependency verification for each layer
- [x] `/frontend-developer` — template refactoring
- [x] `/code-reviewer` — Playwright regression testing

---
**Status**: Draft — awaiting approval
