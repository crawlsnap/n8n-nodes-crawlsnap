# n8n-nodes-crawlsnap

An [n8n](https://n8n.io) community node that wraps the public
[CrawlSnap](https://crawlsnap.com) data intelligence API. Published on npm as
`n8n-nodes-crawlsnap` (unscoped) and on GitHub at
`github.com/crawlsnap/n8n-nodes-crawlsnap` (default branch `main`).

## What it is

A **declarative-style** node (routing-only, no runtime dependencies — this keeps
it eligible for n8n verification). It exposes the CrawlSnap public API
(`https://api.crawlsnap.com`, Bearer `sk-cs-` auth) as n8n operations.

- **3 resources / 9 operations**, mirroring the public OpenAPI surface:
  - **VectorSnap** — `url` / `hash` / `ip` / `domain` (IoC reputation enrichment)
  - **PulseSnap** — `url` / `hash` / `ip` / `domain` (threat-intelligence pulse)
  - **SubdoSnap** — `scan` (subdomain enumeration, `cursor` pagination)
- A single `Query` parameter per operation; the CrawlSnap response envelope
  (`{ data, is_success, ... }`) is unwrapped via `rootProperty: data`.
- `usableAsTool: true` so it works as an AI Agent tool.

## Structure

```
credentials/CrawlSnapApi.credentials.ts   # Bearer auth + credential test
nodes/CrawlSnap/CrawlSnap.node.ts         # the declarative node
nodes/CrawlSnap/crawlsnap.svg             # icon
.github/workflows/release.yml             # OIDC publish on GitHub Release
```

The published npm tarball ships only `dist/` (compiled JS + icon) plus README
and LICENSE — see the `files` field and `.npmignore`.

## Conventions

- **English only** in all code, UI labels, descriptions, and docs (n8n
  verification requirement).
- Each n8n community package must wrap **exactly one** service.
- TypeScript strict; lint via `eslint-plugin-n8n-nodes-base`.
  - The lint plugin wants literal `inputs: ['main']` / `outputs: ['main']`. The
    runtime connection enum in `n8n-workflow` 2.x is `NodeConnectionTypes` (the
    `NodeConnectionType` export is type-only) — but prefer the string literals
    so the node lint passes without importing the enum.

## Build & checks

```bash
npm run build   # rimraf dist .tsbuildinfo && tsc && gulp build:icons
npm run lint    # eslint-plugin-n8n-nodes-base
```

**Gotcha:** the build must delete `.tsbuildinfo` together with `dist/`.
Otherwise incremental `tsc` thinks the (deleted) outputs are current, emits
nothing, and the published tarball ends up missing all compiled `.js` files
(only the gulp-copied svg survives). Always verify with
`npm pack --dry-run` that `dist/nodes/CrawlSnap/CrawlSnap.node.js` and
`dist/credentials/CrawlSnapApi.credentials.js` are present.

## Releasing (npm Trusted Publishing / OIDC + provenance)

Publishing is automated — **no npm token is stored in the repo.**
`.github/workflows/release.yml` triggers when a GitHub Release is *published*,
exchanges an OIDC token (`id-token: write`), and runs
`npm publish --provenance --access public`. `publishConfig` sets
`access: public` and `provenance: true`.

To ship a new version:

```bash
npm version X.Y.Z --no-git-tag-version   # bumps package.json + lockfile
# move the ## [Unreleased] entries in CHANGELOG.md under the new version heading
git add package.json package-lock.json CHANGELOG.md && git commit -m "chore: release vX.Y.Z"
git push origin main
gh release create vX.Y.Z --title vX.Y.Z --notes ""  # triggers publish + notes sync
```

The release body is left empty on purpose: the `release-notes` job fills it in
from `CHANGELOG.md`.

## Releases & changelog

`CHANGELOG.md` is the single source of truth for release notes. Every
user-visible change is written into it **in the same commit that makes the
change** — never generated from commit messages afterwards.

- Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) 1.1.0.
  Version headings are `## [x.y.z] - YYYY-MM-DD` (ISO date, newest first) and
  the only section headings allowed are `Added`, `Changed`, `Deprecated`,
  `Removed`, `Fixed`, `Security` and `Breaking`.
- Work in progress goes under `## [Unreleased]`; cutting a release renames that
  heading and updates the link definitions at the bottom of the file.
- Every released version starts with an `API: CrawlSnap public API vN` line.
- The README's `## Version history` table (an n8n convention) keeps a one-line
  summary per version and links to `CHANGELOG.md`; update both.
- The `release-notes` job in `release.yml` copies the tagged section into the
  GitHub Release body. A tag with no matching CHANGELOG section fails the job on
  purpose. Never write release notes by hand in the GitHub UI.
- npm renders only the README, so those README links must be absolute.

Verify provenance after the run: install the package in a clean dir and run
`npm audit signatures` — it should report verified registry signatures and a
verified attestation for this package.

## Verification (n8n marketplace)

Not yet submitted. The path: publish to npm → run
`npx @n8n/scan-community-package n8n-nodes-crawlsnap` (this only works against
the **published** package, not a local checkout) → submit via n8n's community
node verification form.
