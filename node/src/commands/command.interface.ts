import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export interface Command {
	data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute(interaction: CommandInteraction): Promise<void>;
}