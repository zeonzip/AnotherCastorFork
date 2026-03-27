import { basicEmbed } from "../../../common/msg/templates/embeds.js";
import { Category } from "../../../common/command/enums.js";
import { SlashCommandBuilder } from "discord.js";

/** @type {import("../../../common/schema.js").CommandData} */
export const data = {
	name: "slots",
	category: Category.VIP,
	description: "Play a game of slots!",
	constraints: {
		isVIP: true
	},
	options: new SlashCommandBuilder(),
	execute(interaction) 
	{
		const slotItems = [ "🍇", "🍉", "🍊", "🍎", "🍓", "🍒" ];

		let win = false;

		let slots = [];


		for (let i = 0; i < 3; i++)
		{
			slots[ i ] = [
				Math.floor(Math.random() * slotItems.length),
				Math.floor(Math.random() * slotItems.length),
				Math.floor(Math.random() * slotItems.length)
			];
		}

		const number = slots[ 1 ];

		if (number[ 0 ] === number[ 1 ] && number[ 1 ] == number[ 2 ])
		{
			win = true;
		}
		else if (
			number[ 0 ] === number[ 1 ] ||
		number[ 0 ] === number[ 2 ] ||
		number[ 1 ] === number[ 2 ]
		)
		{
			win = true;
		}

		if (win)
		{
			interaction.reply({
				embeds: [
					basicEmbed({
						author: { name: "🎰 Slots" },
						description: slots
							.map((s) => s.map((i) => slotItems[ i ]).join(" "))
							.join("\n")
					})
				]
			});
		}
		else
		{
			interaction.reply({
				embeds: [
					basicEmbed({
						author: { name: "🎰 Slots" },
						description: slots
							.map((s) => s.map((i) => slotItems[ i ]).join(" "))
							.join("\n"),
						color: 15158332
					})
				]
			});
		}
	}
};
