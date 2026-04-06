# Feature: Fix Homepage Header Text Cutoff Below 1500px

## Problem

The homepage hero section's H1 text ("Expert Car Detailing Service in Central Florida") gets cut off at viewport widths between ~1024px and ~1500px.

## Root Cause

The hero section (`#63bd85219866cc3622781520`) uses a **two-column flex-row layout** on desktop (>1024px):
- Left column (text): `width: 51.56%` with `padding-left: 12%` → effective content width is ~40%
- Right column (hero image): `width: 46.44%` with a background image of a car

There are only 3 CSS breakpoints:
- **Desktop** (>1024px): flex-row, text at 51.56% width with 12% left padding
- **Tablet** (768-1024px): flex-column, text at 100% width (stacks vertically)
- **Mobile** (<767px): flex-column, text at 100% width

Between 1024px and ~1500px, the text container becomes too narrow for the H1 but the layout hasn't switched to the stacked tablet view yet. The text overflows or gets clipped.

## CSS IDs (escaped in CSS as `\36 3bd...`)

| Element | ID | Role |
|---------|-----|------|
| Hero grid | `63bd85219866cc362278151f` | Contains the two-column layout |
| Hero row | `63bd85219866cc3622781520` | flex-row with min-height: 500px |
| Text column | `63bd85219866cc3622781521` | width: 51.56%, padding-left: 12% |
| Image column | `63bd85219866cc3622781522` | width: 46.44%, car background image |
| H1 widget | `1285597547` | The heading text |
| Subtitle widget | `1908693615` | "Good morning world!" text |
| Description widget | `1046139593` | Body text |
| CTA group | `group_au8` | Book Online + Call Us buttons |

## Approach Options

### Option A: Reduce left padding at narrower desktop widths
Add a media query for `(min-width: 1025px) and (max-width: 1500px)` that reduces `padding-left` from 12% to something smaller (e.g., 4-6%), giving the text more room.

**Pros:** Minimal change, preserves two-column layout
**Cons:** May still clip at the narrowest end of the range

### Option B: Scale font size down for the H1 at narrower widths
Use `clamp()` or a media query to reduce the H1 font size between 1024-1500px.

**Pros:** Text always fits regardless of width
**Cons:** Smaller text may look different from the design intent

### Option C: Adjust column proportions at narrower widths
Widen the text column (e.g., from 51.56% to 60%) and narrow the image column at this breakpoint.

**Pros:** Gives text more room while keeping two-column layout
**Cons:** Changes the visual balance

### Option D: Combine A + C (Recommended)
At `(min-width: 1025px) and (max-width: 1500px)`:
1. Reduce `padding-left` from 12% to 5%
2. Widen text column from 51.56% to 58%
3. Narrow image column from 46.44% to 40%
4. Allow text to wrap naturally with `word-wrap: break-word`

This gives the text maximum room while preserving the two-column hero layout that breaks to stacked at 1024px.

### Specialist Agents Needed
- [x] `/ux-architect` — responsive breakpoint design
- [x] `/frontend-developer` — CSS implementation

---
**Status**: Draft — awaiting approval
