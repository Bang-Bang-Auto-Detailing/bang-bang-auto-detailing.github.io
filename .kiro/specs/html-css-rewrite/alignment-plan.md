# Visual Alignment Plan: Epic vs Master

## Systematic Fixes (all pages)

### 1. H1 color: #FFFFFA not #FFFFFF
Master uses `rgb(255,255,250)` (off-white). Epic uses pure white.
**Fix:** Update `new-style.css` h1 color to `#FFFFFA`.

### 2. H1 sizing at tablet/mobile
Master uses fixed sizes: 48px desktop, 50px tablet, 35px mobile.
Epic uses clamp(28px, 4.5vw, 48px) which gives 34.56px at 768px and 28px at 375px.
**Fix:** Adjust to `clamp(35px, 5vw, 48px)` to closer match master's tablet (50px is too large — it was the original bug we fixed). 35px mobile matches master exactly. Tablet will be ~38px at 768px (closer to master's intent without the clipping bug).

### 3. Section vertical padding
Service pages are 20-38% shorter because epic sections have less vertical padding.
Master sections have large spacing from the flex layout system.
**Fix:** Increase `--space-3xl` from 4rem to 5rem (64px → 80px) for section padding.

### 4. Gallery image sizing
Gallery page is 65-117% taller because images render at full height.
Master crops them with `background-image` and fixed `padding-top` percentages.
**Fix:** Add `max-height: 400px` on gallery items and `object-fit: cover`.

## Intentional Differences (keep as-is)

These are improvements, not regressions:

1. **Body font** — Master shows `Times New Roman` (fallback) because DudaMobile CSS sets font on `#dm` inner div, not `<body>`. Epic correctly sets Quicksand on `<body>`. Keep.

2. **Removed "Areas we serve" section** — Empty section on master with just a heading. No content. Keep removed.

3. **Removed "Check out Our YouTube Channel" section** — Empty embed with no video. Keep removed.

4. **Removed duplicate "Why Choose TidyUp" sections** — Template artifacts from DudaMobile's cleaning service template. Clearly wrong content. Keep removed.

5. **Removed "Want Big Savings" sections** — Duplicate sections referencing "Weekly Cleanings" — wrong business. Keep removed.

6. **Contact page taller** — Has a proper form + map. Master had a compact DudaMobile widget. New version is better UX. Keep.

## Estimated alignment after fixes

With padding and sizing adjustments, page heights should be within 10-15% of master for service pages. Gallery and contact will remain intentionally different (better layout).
