import { SlashCommandBuilder } from "discord.js";
import { basicEmbed } from "../../../common/msg/templates/embeds.js";
import { Category } from "../../../common/command/enums.js";

/** @type {import("../../../common/schema.js").CommandData} */
export const data = {
	name: "coinflip",
	description: "Flip a coin and guess the side!",
	category: Category.VIP,
	constraints: {
		isVIP: true
	},
	options: new SlashCommandBuilder().addStringOption((option) =>
		option
			.setName("side")
			.setDescription("The side you want to guess")
			.addChoices(
				{ name: "Heads", value: "heads" },
				{ name: "Tails", value: "tails" },
			)
			.setRequired(true),
	),
	execute(interaction) 
	{
		const n = Math.floor(Math.random() * 2) === 0 ? "heads" : "tails";

		const guess = interaction.options.getString("side");
		const result =
      guess === n
      	? {
      		author: { name: "🪙 Coinflip" },
      		color: 0x00ff00,
      		description: `You guessed **${guess}** and the coin landed on **${n}**. You win!`,
      	}
      	: {
      		author: { name: "🪙 Coinflip" },
      		color: 0xff0000,
      		description: `You guessed **${guess}** and the coin landed on **${n}**. You lose!`,
      	};

		return interaction.reply({
			embeds: [basicEmbed(result)],
		});
	},
};
