import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export async function loadCommandsFromDir(commandsDir) 
{
	const commands = [];
	const commandsJson = [];

	async function walk(dir) 
	{
		try 
		{
			const entries = await fs.promises.readdir(dir, { withFileTypes: true });
            
			await Promise.all(entries.map(async (entry) => 
			{
				const fullPath = path.join(dir, entry.name);

				if (entry.isDirectory()) 
				{
					return walk(fullPath);
				}

				if (entry.isFile() && /\.(js|mjs|cjs)$/.test(entry.name)) 
				{
					try 
					{
						const fileUrl = pathToFileURL(fullPath).href;
						const mod = await import(fileUrl);
                        
						const exported = mod.default ?? mod;
						const commandData = exported.data;

						if (commandData) 
						{
							const builder = commandData.options;

							if (builder && typeof builder.setName === "function") 

							{
								if (!exported.data.constraints) 
								{
									exported.data.constraints = {};
								}
								if (exported.data.options)
								{
									if (exported.data.name) 
									{
										builder.setName(exported.data.name);
									}
									if (exported.data.description) 
									{
										builder.setDescription(exported.data.description);
									}
								

								}
							}

							const finalJson = builder && builder.toJSON ? builder.toJSON() : commandData;

							commands.push({ filePath: fullPath, module: mod, data: commandData });
							commandsJson.push(finalJson);
						}
					} 
					catch (err) 
					{
						console.warn(`Failed to import command ${fullPath}:`, err.message || err);
					}
				}
			}));
		} 
		catch (err) 
		{
			console.warn(`Failed to read directory ${dir}:`, err.message || err);
		}
	}

	await walk(commandsDir);
	return { commands, commandsJson };
}