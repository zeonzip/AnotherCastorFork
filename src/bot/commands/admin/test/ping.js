import { SlashCommandBuilder } from "discord.js";
import { pingComponent } from "../../../../common/msg/templates/components.js";
import { Precondition } from "../../../../common/preconditions/precondition.js";
import { Flags } from "../../../../common/flags/message.js";
import { Category } from "../../../../common/command/enums.js";

export const data = {
	name: "ping",
	description: "Replies with Pong!",
	category: Category.ADMIN,
	options: new SlashCommandBuilder(),
	async execute(interaction) 
	{
		if (!Precondition.check.isAdmin(interaction)) 
		{
			return Precondition.result.denied(interaction);
		}

		await interaction.reply({
			content: "",
			components: pingComponent(interaction),
			flags: Flags.IS_COMPONENTS_V2 | Flags.EPHEMERAL,
		});
	},
};
