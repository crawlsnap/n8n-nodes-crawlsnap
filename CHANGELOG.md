# Changelog

All notable changes to the `n8n-nodes-crawlsnap` community node are documented
in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this package adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
While the node is pre-1.0, minor versions may carry breaking changes; those are
always called out under a `Breaking` heading.

Every entry records the CrawlSnap public API version the node talks to.

Releases before 0.1.1 are not listed here; see the
[git history](https://github.com/crawlsnap/n8n-nodes-crawlsnap/commits/main) for those.

## [Unreleased]

## [0.2.0] - 2026-09-08

API: CrawlSnap public API `v1`

### Added

- **SerpApi** resource with a **Search** operation (`GET /v1/serp/search`):
  ranked Google results for a query, with real target URLs already unwrapped
  from Google's redirector, plus the related searches Google suggests.
  Takes a **Search Query**, and an **Additional Fields** collection carrying
  Count, Page, Language, Country, Safe Search, Time Range, Site and File Type.
  One call returns one result page, so raise Page rather than Count — Count only
  caps what is returned from the page you asked for.

### Changed

- The shared **Query** field is now scoped to VectorSnap / PulseSnap /
  SubdoSnap. SerpApi has its own **Search Query** field because the API takes
  `q`, not `query`.

## [0.1.1] - 2026-06-20

API: CrawlSnap public API `v1`

### Fixed

- The build now clears the incremental `tsbuildinfo` so `dist/` is always
  recompiled from source; a stale cache could otherwise ship an outdated bundle.

### Changed

- Publishing moved to npm Trusted Publishing (OIDC) with provenance, so no
  long-lived npm token is stored in the repository.

[Unreleased]: https://github.com/crawlsnap/n8n-nodes-crawlsnap/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/crawlsnap/n8n-nodes-crawlsnap/releases/tag/v0.1.1
