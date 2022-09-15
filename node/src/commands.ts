import countdown from "./commands/countdown";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection, CommandInteraction } from "discord.js";

export interface Command {
	data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute(interaction: CommandInteraction): Promise<void>;
}

const guildCommands: Command[] = [
];
const globalCommands: Command[] = [
	countdown,
];
	
export const loadCommands = (filter: 'all' | 'guild' | 'global' = 'all') => {
	let commands: Command[] = [];
	if (filter == 'all') {
		commands = [...guildCommands, ...globalCommands];
	} else if (filter == "guild") {
		commands = [...guildCommands];
	} else if (filter == "global") {
		commands = [...globalCommands];
	}

	const collection = new Collection<string, Command>();
	commands.forEach(command => {
		collection.set(command.data.name, command);
	});
	return collection;
}