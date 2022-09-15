import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Interaction } from 'discord.js';
import { loadCommands } from './commands';
import { loadConfig } from './util/util';

export class RestCommands {

	static config = loadConfig();
	static rest = new REST({ version: '9' }).setToken(RestCommands.config.token);
	static guildCommands = loadCommands('guild');
	static globalCommands = loadCommands('global');

	public static updateGuildCommands() {
		const commands: any[] = [];
		this.guildCommands.each(command => {
			commands.push(command.data.toJSON());
		});

		try {
			this.config.guildIds.forEach(async guildId => {
				await this.rest.put(
					Routes.applicationGuildCommands(this.config.clientId, guildId),
					{ body: commands },
				);
			});
		} catch (error) {
			console.error(error);
		}
	}

	public static clearGuildCommands() {
		try {
			this.config.guildIds.forEach(async guildId => {
				const commands = await this.rest.get(
					Routes.applicationGuildCommands(this.config.clientId, guildId),
				) as Interaction[] || [];

				commands.forEach(async command => {
					await this.rest.delete(
						Routes.applicationGuildCommand(this.config.clientId, guildId, command.id),
					);
				});
			});
		} catch (error) {
			console.error(error);
		}
	}

	public static async updateGlobalCommands() {
		const commands: any[] = [];
		this.globalCommands.each(command => {
			commands.push(command.data.toJSON());
		});

		try {
			await this.rest.put(
				Routes.applicationCommands(this.config.clientId),
				{ body: commands },
			);
		} catch (error) {
			console.error(error);
		}
	}

	public static async clearGlobalCommands() {
		try {
			const commands = await this.rest.get(
				Routes.applicationCommands(this.config.clientId),
			) as Interaction[] || [];

			commands.forEach(async command => {
				await this.rest.delete(
					Routes.applicationCommand(this.config.clientId, command.id),
				);
			});
		} catch (error) {
			console.error(error);
		}
	}
}
