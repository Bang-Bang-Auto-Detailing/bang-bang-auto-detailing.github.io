# Visual regression testing (BackstopJS)

Compares every page of the local dev site against production
(https://www.bangbangautodetailing.com) at the four CSS breakpoint bands:
375 (≤480), 600 (481–768), 900 (769–1024), 1440 (≥1025).

## Usage

```bash
npm start                    # dev server must be running on :8080
npm run backstop:reference   # capture production baselines (~2 min)
npm run backstop:test        # capture local + diff against baselines
```

Results land in `tests/backstop/backstop_data/` (gitignored, including the
reference bitmaps — they're ~70MB and regenerable). The JSON report is at
`backstop_data/json_report/jsonReport.json`; per-pair diff PNGs are in
`backstop_data/bitmaps_test/<timestamp>/`.

## Notes

- `engine_scripts/onReady.cjs` forces lazy images eager, scrolls the full page,
  waits (max 5s) for image decode, and freezes CSS animations. Without the
  image wait, `loading="lazy"` images at the page bottom (e.g. the footer
  logo) are missing from captures and produce false positives.
- Map containers are hidden in both captures (`#map`, `.map` locally;
  `.mapContainer` on the legacy production site) because Mapbox tiles render
  nondeterministically. The map is therefore NOT covered by these tests.
- `crop.cjs` extracts a horizontal band from a tall screenshot for inspection:
  `node tests/backstop/crop.cjs <image> <y0> <y1> <out.png>`
- Once the rewrite deploys to production, re-run `backstop:reference` — the
  baseline then becomes the new design and this suite turns into a normal
  deploy-regression check.
