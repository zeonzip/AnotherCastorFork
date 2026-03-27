import path from "path";
import { loadCommandsFromDir } from "./loadCommands.js";
import { Flags } from "../../../common/flags/message.js";
import { Precondition } from "../../../common/preconditions/precondition.js";
import { handleTicTacToe } from "../../../utils/interactions/tictactoe.js";
import { handleRPS } from "../../../utils/interactions/rps.js";

async function handleInteractionError(interaction) 
{
	const payload = {
		content: "There was an error while executing this command.",
		flags: Flags.EPHEMERAL
	};
	try 
	{
		if (interaction.deferred || interaction.replied) 
		{
			return await interaction.followUp(payload);
		}
		return await interaction.reply(payload);
	}
	catch (err) 
	{
		console.warn("Error handling command error:", err);
	}
}

async function runPreconditions(interaction, constraints) 
{
	if (constraints.isAdmin && !Precondition.check.isAdmin(interaction)) 
	{
		return false;
	}
	if (constraints.isStaff && !Precondition.check.isStaff(interaction)) 
	{
		return false;
	}
	if (constraints.isSrMod && !Precondition.check.isSrMod(interaction)) 
	{
		return false;
	}
	if (constraints.hasFunCommands && !Precondition.check.hasFunCommandAccess(interaction)) 
	{
		return false;
	}
	if (constraints.isVIP && !Precondition.check.isVIPCID(interaction)) 
	{
		return false;
	}
	return true;
}

export default async function handleInteractions({ client }) 
{
	const commandsDir = path.join(process.cwd(), "src", "bot", "commands");
	const { commands } = await loadCommandsFromDir(commandsDir);

	for (const c of commands) 
	{
		const name = c.data.name ?? c.data.toJSON?.().name;
		if (name) 
		{
			client.commands.set(name, c);
		}
	}

	client.on("interactionCreate", async (interaction) => 
	{
		const isCommand = interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand();
        
		if (isCommand) 
		{
			const commandRecord = client.commands.get(interaction.commandName);
			if (!commandRecord) 
			{
				return;
			}

			const { module, data } = commandRecord;

			try 
			{
				if (data.constraints) 
				{
					const passed = await runPreconditions(interaction, data.constraints);
					if (!passed) 
					{
						return Precondition.result.denied(interaction);
					}
				}

				await module.data.execute(interaction);
			}
			catch (err) 
			{
				console.error(`Error executing ${interaction.commandName}:`, err);
				await handleInteractionError(interaction);
			}
			return;
		}

		if (interaction.isMessageComponent()) 
		{
			const customId = interaction.customId;
			if (!customId) 
			{
				return;
			}

			try 
			{
				if (customId.startsWith("ttt_")) 
				{
					await handleTicTacToe(interaction, client);
				}
				else if (customId.startsWith("rps_")) 
				{
					await handleRPS(interaction, client);
				}
			}
			catch (err) 
			{
				console.error("Component Error:", err);
				if (!interaction.replied && !interaction.deferred) 
				{
					await interaction.reply({ content: "Interaction failed.", flags: Flags.EPHEMERAL });
				}
			}
		}
	});
}
