# Design: Generate sitemap.xml

## Approach
Create a Liquid template at the project root that outputs valid sitemap XML. Eleventy will process it on every build. No plugins needed.

## Files

| File | Action | Purpose |
|------|--------|---------|
| `sitemap.liquid` | Create | Template that iterates over all pages and outputs sitemap XML |

## How It Works
- Front matter sets `permalink: /sitemap.xml` and excludes it from collections
- Uses `collections.all` to iterate over all pages
- Filters out 404 and non-HTML outputs
- Outputs absolute URLs using `https://www.bangbangautodetailing.com` base

---
**Status**: Approved (collapsed with tasks due to small scope)
