import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class CrawlSnap implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CrawlSnap',
		name: 'crawlSnap',
		icon: 'file:crawlsnap.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Query CrawlSnap data intelligence APIs (VectorSnap, PulseSnap, SubdoSnap)',
		defaults: {
			name: 'CrawlSnap',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'crawlSnapApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			// ----------------------------------------------------------------
			// Resource
			// ----------------------------------------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'VectorSnap',
						value: 'vectorSnap',
						description: 'IoC reputation enrichment for a URL, hash, IP, or domain',
					},
					{
						name: 'PulseSnap',
						value: 'pulseSnap',
						description: 'Threat-intelligence pulse enrichment for a URL, hash, IP, or domain',
					},
					{
						name: 'SubdoSnap',
						value: 'subdoSnap',
						description: 'Paginated subdomain enumeration for a domain',
					},
				],
				default: 'vectorSnap',
			},

			// ----------------------------------------------------------------
			// VectorSnap operations
			// ----------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: { resource: ['vectorSnap'] },
				},
				options: [
					{
						name: 'Enrich URL',
						value: 'url',
						action: 'Enrich a URL',
						description: 'Reputation, detections, categories, and relationships for a URL',
						routing: {
							request: { method: 'GET', url: '/v1/ioc/search/url' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
						},
					},
					{
						name: 'Enrich Hash',
						value: 'hash',
						action: 'Enrich a file hash',
						description: 'File analysis for an MD5, SHA-1, or SHA-256 hash',
						routing: {
							request: { method: 'GET', url: '/v1/ioc/search/hash' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
						},
					},
					{
						name: 'Enrich IP',
						value: 'ip',
						action: 'Enrich an IP address',
						description: 'Reputation, WHOIS, ASN, and relationships for an IPv4 address',
						routing: {
							request: { method: 'GET', url: '/v1/ioc/search/ip' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
						},
					},
					{
						name: 'Enrich Domain',
						value: 'domain',
						action: 'Enrich a domain',
						description: 'Reputation, WHOIS, DNS, certificates, categories, and relationships',
						routing: {
							request: { method: 'GET', url: '/v1/ioc/search/domain' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
						},
					},
				],
				default: 'url',
			},

			// ----------------------------------------------------------------
			// PulseSnap operations
			// ----------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: { resource: ['pulseSnap'] },
				},
				options: [
					{
						name: 'Scan URL',
						value: 'url',
						action: 'Scan a URL',
						description: 'Threat-intelligence pulse summary for a URL',
						routing: {
							request: { method: 'GET', url: '/v1/pulse-snap/scan/url' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
						},
					},
					{
						name: 'Scan Hash',
						value: 'hash',
						action: 'Scan a file hash',
						description: 'Threat-intelligence pulse summary for a file hash',
						routing: {
							request: { method: 'GET', url: '/v1/pulse-snap/scan/hash' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
						},
					},
					{
						name: 'Scan IP',
						value: 'ip',
						action: 'Scan an IP address',
						description: 'Threat-intelligence pulse summary for an IP address',
						routing: {
							request: { method: 'GET', url: '/v1/pulse-snap/scan/ip' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
						},
					},
					{
						name: 'Scan Domain',
						value: 'domain',
						action: 'Scan a domain',
						description: 'Threat-intelligence pulse summary for a domain',
						routing: {
							request: { method: 'GET', url: '/v1/pulse-snap/scan/domain' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
						},
					},
				],
				default: 'url',
			},

			// ----------------------------------------------------------------
			// SubdoSnap operations
			// ----------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: { resource: ['subdoSnap'] },
				},
				options: [
					{
						name: 'Scan Subdomains',
						value: 'scan',
						action: 'Enumerate subdomains for a domain',
						description: 'Paginated subdomain enumeration for a domain',
						routing: {
							request: { method: 'GET', url: '/v1/subdo-snap/scan' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
						},
					},
				],
				default: 'scan',
			},

			// ----------------------------------------------------------------
			// Query (shared by every operation)
			// ----------------------------------------------------------------
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. https://example.com, 8.8.8.8, example.com, or a file hash',
				description:
					'The indicator to look up. Provide a URL, file hash, IPv4 address, or domain to match the selected operation.',
				routing: {
					request: {
						qs: { query: '={{$value}}' },
					},
				},
			},

			// ----------------------------------------------------------------
			// Cursor (SubdoSnap pagination)
			// ----------------------------------------------------------------
			{
				displayName: 'Cursor',
				name: 'cursor',
				type: 'string',
				default: '',
				displayOptions: {
					show: { resource: ['subdoSnap'], operation: ['scan'] },
				},
				description:
					'Pagination cursor from a previous response (data.cursor). Leave empty to fetch the first page.',
				routing: {
					request: {
						qs: { cursor: '={{$value || undefined}}' },
					},
				},
			},
		],
	};
}
