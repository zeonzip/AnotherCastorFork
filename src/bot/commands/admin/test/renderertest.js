import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import {
	addComponentRowToMessage,
	createSimpleMessage,
} from "../../../../web/messageBuilder.js";
import { renderDiscordMessages } from "../../../../web/messageRenderer.js";
import { buttonStyles, buttonTypes } from "../../../../web/buttonTypes.js";
import { Precondition } from "../../../../common/preconditions/precondition.js";
import { Category } from "../../../../common/command/enums.js";

// mr stark, remove this

export const data = {
	name: "renderpingtest",
	description: "Replies with pong! as a rendered image.",
	category: Category.ADMIN,
	options: new SlashCommandBuilder(),
	async execute(interaction) 
	{
		if (!Precondition.check.isAdmin(interaction)) 
		{
			return Precondition.result.denied(interaction);
		}

		let msg = createSimpleMessage(
			interaction.client.user.username,
			interaction.client.user.displayAvatarURL({ format: "png" }),
			true,
			"This is a render test of web-components and puppeteer that helps render and sends these images.\n\nThis is built using a custom library.",
		);

		addComponentRowToMessage(msg, [
			{
				type: buttonTypes.COMPONENT_TYPE_BUTTON,
				style: buttonStyles.BUTTON_STYLE_PRIMARY,
				label: "Danger!",
			},
		]);

		const messages = [msg];

		const buffer = await renderDiscordMessages(messages);
		const attachment = new AttachmentBuilder(buffer, { name: "ping.png" });

		await interaction.reply({ files: [attachment], ephemeral: true });
	},
};
