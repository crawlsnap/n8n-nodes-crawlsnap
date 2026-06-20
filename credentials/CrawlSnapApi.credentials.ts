import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CrawlSnapApi implements ICredentialType {
	name = 'crawlSnapApi';

	displayName = 'CrawlSnap API';

	documentationUrl = 'https://crawlsnap.com';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your CrawlSnap API key (starts with "sk-cs-"). Create and rotate keys from your dashboard.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.crawlsnap.com',
			description: 'Override only when targeting a non-production CrawlSnap environment',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	// Validates the key with a single, low-cost lookup. Note: a successful test
	// consumes one request against your quota.
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/ioc/search/ip',
			qs: { query: '8.8.8.8' },
		},
	};
}
