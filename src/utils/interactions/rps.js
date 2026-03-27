import { Flags } from "../../common/flags/message.js";
import { basicEmbed } from "../../common/msg/templates/embeds.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);

const choiceMap = { r: "rock", p: "paper", s: "scissors" };
const beats = { rock: "scissors", paper: "rock", scissors: "paper" };

export async function handleRPS(interaction, client) 
{
	const parts = interaction.customId.split("_");
	if (parts.length < 3)
	{
		return interaction.reply({
			content: "Invalid button.",
			flags: Flags.EPHEMERAL,
		});
	}

	const picked = parts[1];
	const uniqueId = parts.slice(2).join("_");
	const rpsGames = client.games.get("rps") || {};
	const game = rpsGames[uniqueId];

	if (!game)
	{
		return interaction.reply({
			content: "Game not found or has expired.",
			flags: Flags.EPHEMERAL,
		});
	}

	const uid = interaction.user.id;
	const isChallenger = uid === game.challenger?.userId;
	const isOpponent = uid === game.opponent?.userId;

	if (
		!isChallenger &&
    !isOpponent &&
    !(game.opponent?.userId === client.user.id && isChallenger)
	) 
	{
		return interaction.reply({
			content: "You are not part of this game.",
			flags: Flags.EPHEMERAL,
		});
	}

	const pick = choiceMap[picked];
	if (isChallenger && game.challenger.choice)
	{
		return interaction.reply({
			content: "Already chosen.",
			flags: Flags.EPHEMERAL,
		});
	}
	if (isOpponent && game.opponent.choice)
	{
		return interaction.reply({
			content: "Already chosen.",
			flags: Flags.EPHEMERAL,
		});
	}

	if (isChallenger) 
	{
		game.challenger.choice = pick;
	}
	else if (isOpponent) 
	{
		game.opponent.choice = pick;
	}

	if (
		game.opponent?.userId === client.user.id &&
    game.challenger.choice &&
    !game.opponent.choice
	) 
	{
		game.opponent.choice = ["rock", "paper", "scissors"][
			Math.floor(Math.random() * 3)
		];
	}

	if (game.challenger.choice && game.opponent.choice) 
	{
		const a = game.challenger.choice;
		const b = game.opponent.choice;
		let resultText =
      a === b
      	? "It's a tie!"
      	: beats[a] === b
      		? `<@${game.challenger.userId}> wins!`
      		: `<@${game.opponent.userId}> wins!`;

		const disabledComponents = interaction.message.components.map((row) => ({
			type: 1,
			components: row.components.map((btn) => ({
				...btn.toJSON(),
				disabled: true,
			})),
		}));

		delete rpsGames[uniqueId];

		return await interaction.update({
			embeds: [
				basicEmbed({
					author: { name: "Rock-Paper-Scissors" },
					description: `Results:\n<@${game.challenger.userId}>: **${a}**\n<@${game.opponent.userId}>: **${b}**\n\n${resultText}`,
					color: 16231462,
				}),
			],
			components: disabledComponents,
		});
	}

	const cStatus = game.challenger.choice ? "✅" : "⏳";
	const oStatus = game.opponent.choice
		? "✅"
		: game.opponent.userId === client.user.id
			? "🤖"
			: "⏳";

	await interaction.update({
		embeds: [
			basicEmbed({
				author: { name: "Rock-Paper-Scissors" },
				description: `Waiting for players...\n<@${game.challenger.userId}>: ${cStatus}\n<@${game.opponent.userId}>: ${oStatus}`,
				color: 16231462,
			}),
		],
		components: interaction.message.components,
	});
}

export function getUniqueRpsId(client) 
{
	const rpsGames = client.games.get("rps") || {};
	let uniqueId = nanoid();
	while (rpsGames[uniqueId]) 
	{
		uniqueId = nanoid();
	}

	return uniqueId;
}

export function addRpsGameData(client, uniqueId, userId, opponentId, isBot = false) 
{
	client.games.set("rps", {
		...client.games.get("rps"),
		[uniqueId]: {
			challenger: { userId, choice: null },
			opponent: { userId: opponentId, choice: null },
			uniqueId,
			createdAt: Date.now(),
			completedAt: null,
			winner: null,
			isBot,
		},
	});
}
