# Feature: Generate sitemap.xml

## Problem
`robots.txt` references `/sitemap.xml` but the file doesn't exist — search engine crawlers hit a 404.

## Scope Correction
The see-our-work.liquid meta description was reported as incorrect ("maid and home cleaning") but is actually fine: "From deep cleans to ceramic coatings, check out our detailing gallery..." — no fix needed.

## Requirements

### User Story 1: Auto-generated Sitemap
**As a** search engine crawler,
**I want** a valid `/sitemap.xml` at the site root,
**So that** all pages are discoverable and indexable.

**Acceptance Criteria:**
1. **When** the site is built, **the system shall** generate a `/sitemap.xml` containing all page URLs
2. **When** a page is added or removed, **the system shall** automatically update the sitemap on next build
3. **When** the sitemap is generated, **the system shall** exclude non-page outputs (404, assets)
4. **When** the sitemap is generated, **the system shall** use absolute URLs with `https://www.bangbangautodetailing.com` as the base

### Success Metrics
- `/sitemap.xml` exists in the build output
- Contains all 12 page URLs
- Valid XML per the sitemap protocol spec
- `robots.txt` reference resolves successfully

### Specialist Agents Needed
- [x] `/seo-specialist` — sitemap generation and validation
- [x] `/frontend-developer` — Eleventy template implementation

---
**Status**: Draft — awaiting approval
