import { SlashCommandBuilder } from "discord.js";
import { basicEmbed } from "../../../common/msg/templates/embeds.js";
import { fetchGuildLeaderboard } from "../../../database/queries.js";
import { Flags } from "../../../common/flags/message.js";
import { Category } from "../../../common/command/enums.js";

/** @type {import("../../../common/schema.js").CommandData} */
export const data = {
	name: "leaderboard",
	category: Category.VIP,
	description: "Show the leaderboard.",
	constraints: {
		isVIP: true
	},
	options: new SlashCommandBuilder(),
	async execute(interaction) 
	{

		try 
		{
			const users = await fetchGuildLeaderboard();

			if (users.length === 0) 
			{
				return interaction.reply({
					content: "There are no users in the leaderboard.",
					flags: Flags.EPHEMERAL,
				});
			}

			const text = users
				.map(
					(user, index) =>
						`**#${index + 1}** <@${user.userId}> - ${user.balance} coins`,
				)
				.join("\n\n");

			return interaction.reply({
				embeds: [
					basicEmbed({
						author: { name: "🏆 Leaderboard" },
						description: text,
						footer: { text: "Use /search to get some coins!" },
					}),
				],
			});
		}
		catch (error) 
		{
			console.log(interaction.user.id, error);
		}
	},
};
