import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { asyncPause } from '../util/util';
import { Command } from '../commands';

export default {
	data: new SlashCommandBuilder()
		.setName('countdown')
		.setDescription('Counts down from a number')
		.addIntegerOption(option => option
			.setName('number')
			.setDescription('seconds to count down from, 3 by default, up to 30')
			.setRequired(false)
		),
	async execute(interaction: CommandInteraction) {
		let n = interaction.options.getInteger('number', false) || 3;
		if (n <= 0 || n > 30) {
			await interaction.reply('Number should be between 1 and 30 seconds');
			await asyncPause(5000);
			await interaction.deleteReply();
			return;
		}
		while (n >= 1) {
			if (interaction.replied) {
				await interaction.editReply(n.toString());
			} else {
				await interaction.reply(n.toString());
			}
			n -= 1;
			await asyncPause(1000);
		}
		await interaction.editReply('Go!');
	}
} as Command;