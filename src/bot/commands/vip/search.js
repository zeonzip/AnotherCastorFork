import { SlashCommandBuilder } from "discord.js";
import { fetchOrCreateUser, updateUser } from "../../../database/queries.js";
import { Flags } from "../../../common/flags/message.js";
import { Category } from "../../../common/command/enums.js";

function getRandomNumber(min, max)
{
	return Math.floor(Math.random() * (max - min) + min);
}

/** @type {import("../../../common/schema.js").CommandData} */
export const data = {
	name: "search",
	category: Category.VIP,
	description: "Search your surroundings for some coins!",
	constraints: {
		isVIP: true
	},
	options: new SlashCommandBuilder(),
	async execute(interaction) 
	{
		const messages = [
			"🪙 You rummage through the couch cushions... Jackpot! You found **{{amount}} coins**!",
			"🏚️ You peek under the floorboards and discover {{amount}} dusty old coins. Nice find!",
			"🗄️ You search the drawers and—score! You pocket **{{amount}} coins**.",
			"🏆 Behind a picture frame, you find a hidden stash of **{{amount}} coins**! Who knew treasure was so close?",
			"🎩 You check inside an old top hat and—aha! **{{amount}} coins** spill out.",
			"📦 You open a suspicious-looking box and—bingo! **{{amount}} coins** are now yours.",
			"🏠 You tap the walls and find a secret compartment! Inside? {{amount}} shiny coins!",
			"📚 You flip through an old book and—what’s this? A hidden slot containing **{{amount}} coins**!",
			"🛏️ You lift the mattress and, lo and behold, **{{amount}} coins** were hiding there all along!",
			"🗑️ You reluctantly check the trash can... and somehow, you find **{{amount}} coins**. Gross, but worth it!"
		];

		try
		{
			const amount = getRandomNumber(3, 8);

			const user = await fetchOrCreateUser(interaction.user.id);

			if (user.search.next > Date.now())
			{
				const time = Math.floor(user.search.next / 1000);
				return interaction.reply({
					content: `You can only search once every <t:${time}:R>!`,
					flags: Flags.EPHEMERAL
				});
			}

			user.balance += amount;
			user.search.next = Date.now() + 30000;
			user.search.count++;
			user.search.amount += amount;
			user.username = interaction.user.username;

			await updateUser(interaction.user.id, user);

			const randomMessage = messages[
				getRandomNumber(0, messages.length - 1)
			].replace("{{amount}}", amount);

			const time = Math.floor((Date.now() + 30000) / 1000);

			return interaction.reply({
				content: `${randomMessage}\n\nYou can search again <t:${time}:R>!`
			});
		}
		catch (error)
		{
			console.log(interaction.user.id, error);
		}
	}
};
