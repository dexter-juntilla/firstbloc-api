import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { ResponsePayload } from 'Config/commons';

export default class AppProvider {
	constructor(protected app: ApplicationContract) {}

	public register() {
		// Register your own bindings
	}

	public async boot() {
		// IoC container is ready
		const Response = this.app.container.use('Adonis/Core/Response');

		Response.macro('sendResponse', function (response: ResponsePayload) {
			this.ctx!.response.status(response.statusCode);
			this.ctx!.response.json(response);
			return this;
		});
	}

	public async ready() {
		// App is ready
		if (this.app.environment === 'web') {
			await import('../start/socket');
		}
	}

	public async shutdown() {
		// Cleanup, since app is going down
	}
}
