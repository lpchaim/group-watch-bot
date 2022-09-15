import { Client, Collection, Intents, Interaction } from 'discord.js';
import { Command, loadCommands } from './commands';

export type Config = {
	token: string,
	clientId: string,
	guildIds: string[],
};

export default class GroupWatchBot {

	public client: Client;

	private commands = new Collection<string, Command>();

	public constructor(private config: Config) {
		this.client = new Client({ intents: [Intents.FLAGS.GUILDS] });
	}
	
	//* Run bot

	public run() {
		this.client.login(this.config.token);
		this.commands = loadCommands('all');
		this.client.on('interactionCreate', interaction => this.runCommand(interaction));
	}

	public destroy() {
		this.client.destroy();
	}

	private async runCommand(interaction: Interaction): Promise<void> {

		if (!interaction.isCommand()) return;

		const { commandName } = interaction;

		if (!this.commands.has(commandName)) return;

		try {
			const command = this.commands.get(commandName);
			if (command) {
				await command.execute(interaction);
			}
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}