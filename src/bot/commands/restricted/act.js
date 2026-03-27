import { actions, objects } from "../../../database/actStorage.js";
import { SlashCommandBuilder } from "discord.js";
import { Flags } from "../../../common/flags/message.js";
import { Category } from "../../../common/command/enums.js";

function doAction(author, user) 
{
	const action = actions[Math.floor(Math.random() * actions.length)];
	const object = objects[Math.floor(Math.random() * objects.length)];
	return `<@!${author}> ${action} <@!${user}> with ${object}!`;
}

/** @type {import("../../../common/schema.js").CommandData} */
export const data = {
	name: "act",
	description: "Perform a fun action towards another user!",
	category: Category.RESTRICTED,
	constraints: {
		hasFunCommands: true
	},
	options: new SlashCommandBuilder().addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to perform the action on")
			.setRequired(true),
	),
	async execute(interaction) 
	{
		const targetUser = interaction.options.getUser("user");

		if (targetUser.id === interaction.user.id) 
		{
			await interaction.reply({
				content: "You cannot perform this action on yourself!",
				flags: Flags.EPHEMERAL,
			});
			return;
		}

		const actionMessage = doAction(interaction.user.id, targetUser.id);
		await interaction.reply({
			content: actionMessage,
			allowedMentions: { parse: [] },
		});
	},
};
