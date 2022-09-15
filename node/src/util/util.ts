import config from '../config.json';

export const loadConfig = () => {
	validateConfig(config);
	return config;
};
export const validateConfig = (config: any): void  => {
	const notFound = (sub: string) => `${sub} not found`;

	if (!config?.token) {
		throw new Error(notFound('Token'));
	}
	if (!config?.clientId) {
		throw new Error(notFound('Client ID'));
	}
	if (!config?.guildIds?.length) {
		throw new Error(notFound('Guild IDs'));
	}
}

export const asyncPause = (miliss: number) => new Promise<void>(resolve => {
	setTimeout(() => {
		resolve();
	}, miliss)
});