# n8n-nodes-crawlsnap

This is an [n8n](https://n8n.io) community node. It lets you use
[CrawlSnap](https://crawlsnap.com) in your n8n workflows.

CrawlSnap is a data intelligence platform that delivers structured, on-demand
data through fast, typed HTTP APIs. This node exposes the CrawlSnap data
products as n8n operations:

- **VectorSnap** — IoC reputation enrichment (reputation, detections,
  categories, relationships) for a url, hash, IP, or domain.
- **PulseSnap** — threat-intelligence pulse enrichment for a url, hash, IP, or
  domain.
- **SubdoSnap** — paginated subdomain enumeration for a domain.

[Installation](#installation) ·
[Credentials](#credentials) ·
[Operations](#operations) ·
[Usage](#usage) ·
[Resources](#resources)

## Installation

Follow the
[community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/)
in the n8n documentation.

In short: **Settings → Community Nodes → Install**, then enter
`n8n-nodes-crawlsnap`.

## Credentials

You need a CrawlSnap API key (starts with `sk-cs-`). Create and rotate keys
from your [CrawlSnap dashboard](https://crawlsnap.com).

In n8n, create a **CrawlSnap API** credential and paste your key. The node
authenticates every request with `Authorization: Bearer <key>`.

> The credential **Test** button performs one real IP lookup to validate the
> key, which consumes a single request from your quota.

## Operations

| Resource   | Operation         | Endpoint                      |
| ---------- | ----------------- | ----------------------------- |
| VectorSnap | Enrich URL        | `GET /v1/ioc/search/url`      |
| VectorSnap | Enrich Hash       | `GET /v1/ioc/search/hash`     |
| VectorSnap | Enrich IP         | `GET /v1/ioc/search/ip`       |
| VectorSnap | Enrich Domain     | `GET /v1/ioc/search/domain`   |
| PulseSnap  | Scan URL          | `GET /v1/pulse-snap/scan/url` |
| PulseSnap  | Scan Hash         | `GET /v1/pulse-snap/scan/hash`|
| PulseSnap  | Scan IP           | `GET /v1/pulse-snap/scan/ip`  |
| PulseSnap  | Scan Domain       | `GET /v1/pulse-snap/scan/domain` |
| SubdoSnap  | Scan Subdomains   | `GET /v1/subdo-snap/scan`     |

Each operation takes a single **Query** (the indicator to look up). The node
returns the unwrapped `data` payload of the CrawlSnap response envelope.

### Pagination (SubdoSnap)

`Scan Subdomains` is paginated. When more results are available the response
contains a non-empty `cursor`. Pass it back via the **Cursor** field to fetch
the next page.

## Usage

1. Add a **CrawlSnap** node to your workflow.
2. Select a **Resource** (VectorSnap / PulseSnap / SubdoSnap) and **Operation**.
3. Enter the **Query** — a URL, file hash, IPv4 address, or domain.
4. Run. The node outputs the typed enrichment data.

The node is also usable as a tool by the n8n AI Agent node.

## Compatibility

Requires n8n with `n8nNodesApiVersion` 1 (n8n 1.x). Tested on Node.js 20+.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [CrawlSnap website](https://crawlsnap.com)
- [CrawlSnap API reference](https://api.crawlsnap.com)

## Version history

| Version | Changes                                                              |
| ------- | ------------------------------------------------------------------- |
| 0.1.0   | Initial release: VectorSnap, PulseSnap, and SubdoSnap operations.   |

## License

[MIT](LICENSE.md)
