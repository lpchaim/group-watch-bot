import GroupWatchBot, { Config } from './group-watch-bot';

describe('group watch bot', () => {

	let config: Config;
	let instance: GroupWatchBot;

	beforeAll(() => {
		config = require('./config.json');
		instance = new GroupWatchBot(config);
	});

	afterAll(() => {
		if (!!instance) {
			instance.destroy();
		}
	});

	it('should instantiate', () => {
		expect(instance).toBeTruthy();
	});
});