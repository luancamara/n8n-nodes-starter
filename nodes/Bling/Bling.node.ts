import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class Bling implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bling',
		name: 'bling',
		icon: 'file:bling.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Bling API',
		defaults: {
			name: 'Bling',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'blingOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Contas a Pagar',
						value: 'contas-pagar',
					},
					{
						name: 'Contato',
						value: 'contatos',
					},
					{
						name: 'Nota Fiscal',
						value: 'nfe',
					},
					{
						name: 'Pedido De Venda',
						value: 'pedidos-vendas',
					},
					{
						name: 'Produto',
						value: 'produtos',
					},
				],
				default: 'contatos',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contatos'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Criar um contato',
						action: 'Create a contact',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Deletar um contato',
						action: 'Delete a contact',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Obter um contato',
						action: 'Get a contact',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Obter muitos contatos',
						action: 'Get many contacts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Atualizar um contato',
						action: 'Update a contact',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['produtos'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Criar um produto',
						action: 'Create a product',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Deletar um produto',
						action: 'Delete a product',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Obter um produto',
						action: 'Get a product',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Obter muitos produtos',
						action: 'Get many products',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Atualizar um produto',
						action: 'Update a product',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contas-pagar'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Obter contas a pagar em aberto',
						action: 'Get many payable accounts',
					},
				],
				default: 'getAll',
			},
			// Contact ID field
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contatos'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'ID do contato',
			},
			// Product ID field
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['produtos'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'ID do produto',
			},
			// Contact fields for create/update
			{
				displayName: 'Contact Data',
				name: 'contactData',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['contatos'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Nome',
						name: 'nome',
						type: 'string',
						default: '',
						description: 'Nome do contato',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'Email do contato',
					},
					{
						displayName: 'Telefone',
						name: 'telefone',
						type: 'string',
						default: '',
						description: 'Telefone do contato',
					},
					{
						displayName: 'Documento',
						name: 'documento',
						type: 'string',
						default: '',
						description: 'CPF/CNPJ do contato',
					},
				],
			},
			// Product fields for create/update
			{
				displayName: 'Product Data',
				name: 'productData',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['produtos'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Nome',
						name: 'nome',
						type: 'string',
						default: '',
						description: 'Nome do produto',
					},
					{
						displayName: 'Código',
						name: 'codigo',
						type: 'string',
						default: '',
						description: 'Código do produto',
					},
					{
						displayName: 'Preço',
						name: 'preco',
						type: 'number',
						default: 0,
						description: 'Preço do produto',
					},
					{
						displayName: 'Situação',
						name: 'situacao',
						type: 'options',
						options: [
							{
								name: 'Ativo',
								value: 'A',
							},
							{
								name: 'Inativo',
								value: 'I',
							},
						],
						default: 'A',
						description: 'Situação do produto',
					},
				],
			},
			// Date field for accounts payable
			{
				displayName: 'Data Vencimento Final',
				name: 'dataVencimentoFinal',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['contas-pagar'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'Data limite para vencimento das contas (formato YYYY-MM-DD). Se não informado, usa a data atual.',
				placeholder: 'Data limite para buscar contas com vencimento até esta data',
			},
			// Limit field for getAll operations
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < length; i++) {
			try {
				let responseData;

				if (resource === 'contatos') {
					if (operation === 'create') {
						const contactData = this.getNodeParameter('contactData', i) as object;

										const options: IRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: 'https://api.bling.com.br/Api/v3/contatos',
					body: contactData,
					json: true,
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				};

						responseData = await this.helpers.requestOAuth2.call(this, 'blingOAuth2Api', options);
					}

					if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;

						if (!contactId) {
							throw new NodeOperationError(this.getNode(), 'Contact ID is required for get operation', {
								itemIndex: i,
							});
						}

											const options: IRequestOptions = {
						method: 'GET' as IHttpRequestMethods,
						url: `https://api.bling.com.br/Api/v3/contatos/${contactId}`,
						json: true,
						headers: {
							Accept: 'application/json',
						},
					};

						responseData = await this.helpers.requestOAuth2.call(this, 'blingOAuth2Api', options);
					}

					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i) as number;

											const options: IRequestOptions = {
						method: 'GET' as IHttpRequestMethods,
						url: 'https://api.bling.com.br/Api/v3/contatos',
						qs: {
							limite: limit,
						},
						json: true,
						headers: {
							Accept: 'application/json',
						},
					};

						responseData = await this.helpers.requestOAuth2.call(this, 'blingOAuth2Api', options);
					}

					if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const contactData = this.getNodeParameter('contactData', i) as object;

						if (!contactId) {
							throw new NodeOperationError(this.getNode(), 'Contact ID is required for update operation', {
								itemIndex: i,
							});
						}

											const options: IRequestOptions = {
						method: 'PUT' as IHttpRequestMethods,
						url: `https://api.bling.com.br/Api/v3/contatos/${contactId}`,
						body: contactData,
						json: true,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
					};

						responseData = await this.helpers.requestOAuth2.call(this, 'blingOAuth2Api', options);
					}

					if (operation === 'delete') {
						const contactId = this.getNodeParameter('contactId', i) as string;

						if (!contactId) {
							throw new NodeOperationError(this.getNode(), 'Contact ID is required for delete operation', {
								itemIndex: i,
							});
						}

											const options: IRequestOptions = {
						method: 'DELETE' as IHttpRequestMethods,
						url: `https://api.bling.com.br/Api/v3/contatos/${contactId}`,
						json: true,
						headers: {
							Accept: 'application/json',
						},
					};

						responseData = await this.helpers.requestOAuth2.call(this, 'blingOAuth2Api', options);
					}
				}

				if (resource === 'produtos') {
					if (operation === 'create') {
						const productData = this.getNodeParameter('productData', i) as object;

											const options: IRequestOptions = {
						method: 'POST' as IHttpRequestMethods,
						url: 'https://api.bling.com.br/Api/v3/produtos',
						body: productData,
						json: true,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
					};

						responseData = await this.helpers.requestOAuth2.call(this, 'blingOAuth2Api', options);
					}

					if (operation === 'get') {
						const productId = this.getNodeParameter('productId', i) as string;

						if (!productId) {
							throw new NodeOperationError(this.getNode(), 'Product ID is required for get operation', {
								itemIndex: i,
							});
						}

											const options: IRequestOptions = {
						method: 'GET' as IHttpRequestMethods,
						url: `https://api.bling.com.br/Api/v3/produtos/${productId}`,
						json: true,
						headers: {
							Accept: 'application/json',
						},
					};

						responseData = await this.helpers.requestOAuth2.call(this, 'blingOAuth2Api', options);
					}

					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i) as number;

											const options: IRequestOptions = {
						method: 'GET' as IHttpRequestMethods,
						url: 'https://api.bling.com.br/Api/v3/produtos',
						qs: {
							limite: limit,
						},
						json: true,
						headers: {
							Accept: 'application/json',
						},
					};

						responseData = await this.helpers.requestOAuth2.call(this, 'blingOAuth2Api', options);
					}

					if (operation === 'update') {
						const productId = this.getNodeParameter('productId', i) as string;
						const productData = this.getNodeParameter('productData', i) as object;

						if (!productId) {
							throw new NodeOperationError(this.getNode(), 'Product ID is required for update operation', {
								itemIndex: i,
							});
						}

											const options: IRequestOptions = {
						method: 'PUT' as IHttpRequestMethods,
						url: `https://api.bling.com.br/Api/v3/produtos/${productId}`,
						body: productData,
						json: true,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
					};

						responseData = await this.helpers.requestOAuth2.call(this, 'blingOAuth2Api', options);
					}

					if (operation === 'delete') {
						const productId = this.getNodeParameter('productId', i) as string;

						if (!productId) {
							throw new NodeOperationError(this.getNode(), 'Product ID is required for delete operation', {
								itemIndex: i,
							});
						}

											const options: IRequestOptions = {
						method: 'DELETE' as IHttpRequestMethods,
						url: `https://api.bling.com.br/Api/v3/produtos/${productId}`,
						json: true,
						headers: {
							Accept: 'application/json',
						},
					};

						responseData = await this.helpers.requestOAuth2.call(this, 'blingOAuth2Api', options);
					}
				}

				if (resource === 'contas-pagar') {
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i) as number;

						// Obter data customizada ou usar data atual como fallback
						let dataVencimentoFinal = this.getNodeParameter('dataVencimentoFinal', i, '') as string;

						if (!dataVencimentoFinal) {
							// Se não informado, usar data atual no formato YYYY-MM-DD
							const today = new Date();
							dataVencimentoFinal = today.toISOString().split('T')[0];
						} else {
							// Se informado, converter para formato YYYY-MM-DD
							const date = new Date(dataVencimentoFinal);
							dataVencimentoFinal = date.toISOString().split('T')[0];
						}

											const options: IRequestOptions = {
						method: 'GET' as IHttpRequestMethods,
						url: 'https://api.bling.com.br/Api/v3/contas/pagar',
						qs: {
							limite: limit,
							dataVencimentoFinal: dataVencimentoFinal,
							situacao: 1, // Contas em aberto
						},
						json: true,
						headers: {
							Accept: 'application/json',
						},
					};

						responseData = await this.helpers.requestOAuth2.call(this, 'blingOAuth2Api', options);
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData.map((item: any) => ({ json: item })));
				} else if (responseData !== undefined) {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}

