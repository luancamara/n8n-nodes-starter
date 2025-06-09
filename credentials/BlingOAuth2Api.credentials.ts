import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BlingOAuth2Api implements ICredentialType {
	name = 'blingOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Bling OAuth2 API';
	documentationUrl = 'https://developer.bling.com.br/aplicativos';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://www.bling.com.br/Api/v3/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://api.bling.com.br/Api/v3/oauth/token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'response_type=code',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'Client ID obtido ao criar o aplicativo no Bling',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Client Secret obtido ao criar o aplicativo no Bling',
		},
	];
}
