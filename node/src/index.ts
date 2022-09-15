import { argv } from 'node:process';
import GroupWatchBot from './group-watch-bot';
import { RestCommands } from './rest-commands';
import { loadConfig } from './util/util';

enum Command {
	Run = 'run',
	UpdateGuildCommands = 'updateguildcommands',
	ClearGuildCommands = 'clearguildcommands',
	UpdateGlobalCommands = 'updateglobalcommands',
	ClearGlobalCommands = 'clearglobalcommands',
}

const [, , command = Command.Run] = argv;
if (!Object.values(Command).includes(command as Command)) {
	const commands = Object.values(Command).join(', ');
	throw new Error(`Command must be one of: ${commands}`);
}

switch (command) {
	case Command.Run:
		const config = loadConfig();
		const bot = new GroupWatchBot(config);
		bot.run();		
		break;
	case Command.UpdateGuildCommands:
		RestCommands.updateGuildCommands();
		break;
	case Command.ClearGuildCommands:
		RestCommands.clearGuildCommands();
		break;
	case Command.UpdateGlobalCommands:
		RestCommands.updateGlobalCommands();
		break;
	case Command.ClearGlobalCommands:
		RestCommands.clearGlobalCommands();
		break;
}