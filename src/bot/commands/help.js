import { SlashCommandBuilder } from "discord.js";
import { Flags } from "../../common/flags/message.js";
import { Category } from "../../common/command/enums.js";

// mr stark? Is this really coming soon?
export const data = {
	name: "help",
	category: Category.GENERIC,
	description: "Need help with something? Use this command for help!",
	options: new SlashCommandBuilder()
		.addStringOption(option =>
			option
				.setName("page")
				.setDescription("The page to view help for")
				.setRequired(false)
				.addChoices(
					{ name: "Information", value: "info" },
					{ name: "Commands", value: "cmds" },
					{ name: "Make it a Quote", value: "quoter" }
				)),
	execute(interaction) 
	{
		interaction.reply({
			content: "-# coming soon? Is it really??",
			flags: Flags.EPHEMERAL
		});
	}
};
