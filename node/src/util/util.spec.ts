import { Config } from '../group-watch-bot';
import * as util from './util';

describe('util', () => {

	it('should call the function to validate its config file', () => {
		const loadConfig = jest.spyOn(util, 'loadConfig');
		util.loadConfig();
		expect(loadConfig).toHaveBeenCalled();
	});

	it('should throw on loading invalid configuration files', () => {

		const mockConfig: Config = {
			clientId: '123',
			token: '123',
			guildIds: [
				"123",
			],
		};

		let conf = { ...mockConfig };
		conf.token = '';
		expect(() => {
			util.validateConfig(conf);
		}).toThrow();

		conf = { ...mockConfig };
		conf.clientId = '';
		expect(() => {
			util.validateConfig(conf);
		}).toThrow();

		conf = { ...mockConfig };
		conf.guildIds = [];
		expect(() => {
			util.validateConfig(conf);
		}).toThrow();
	});
});