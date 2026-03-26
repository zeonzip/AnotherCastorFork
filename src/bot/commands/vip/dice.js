import { SlashCommandBuilder } from "discord.js";
import { basicEmbed } from "../../../common/msg/templates/embeds.js";
import { Precondition } from "../../../common/preconditions/precondition.js";
import { Category } from "../../../common/command/enums.js";

export const data = {
	name: "dice",
	category: Category.VIP,
	description: "Roll a dice and guess the number!",
	options: new SlashCommandBuilder().addIntegerOption((option) =>
		option
			.setName("guess")
			.setDescription("Your guess for the dice roll (1-6)")
			.setRequired(true)
			.setMaxValue(6)
			.setMinValue(1),
	),
	execute(interaction) 
	{
		if (!Precondition.check.isVIPCID(interaction)) 
		{
			return Precondition.result.denied(interaction);
		}

		const n = Math.floor(Math.random() * 6) + 1;

		const guess = interaction.options.getInteger("guess");
		const result =
      guess === n
      	? {
      		author: { name: "🎲 Dice" },
      		color: 0x00ff00,
      		description: `You guessed **${guess}** and the dice rolled **${n}**. You win!`,
      	}
      	: {
      		author: { name: "🎲 Dice" },
      		color: 0xff0000,
      		description: `You guessed **${guess}** and the dice rolled **${n}**. You lose!`,
      	};

		return interaction.reply({
			embeds: [basicEmbed(result)],
		});
	},
};
