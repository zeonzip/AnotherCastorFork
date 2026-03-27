import { SlashCommandBuilder } from "discord.js";
import { pingComponent } from "../../../../common/msg/templates/components.js";
import { Flags } from "../../../../common/flags/message.js";
import { Category } from "../../../../common/command/enums.js";

/** @type {import("../../../../common/schema.js").CommandData} */
export const data = {
	name: "ping",
	description: "Replies with Pong!",
	category: Category.ADMIN,
	constraints: {
		isAdmin: true
	},
	options: new SlashCommandBuilder(),
	async execute(interaction) 
	{
		await interaction.reply({
			content: "",
			components: pingComponent(interaction),
			flags: Flags.IS_COMPONENTS_V2 | Flags.EPHEMERAL,
		});
	},
};
