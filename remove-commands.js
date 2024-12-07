const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started removing application (/) commands.');

        // Fetch all registered commands
        const commands = await rest.get(Routes.applicationCommands(clientId));

        // Remove specific command by name
        for (const command of commands) {
            if (command.name === 'welcome') { // Change 'welcome' to the duplicated command name
                await rest.delete(Routes.applicationCommand(clientId, command.id));
                console.log(`Successfully deleted command: ${command.name}`);
            }
        }

        console.log('Successfully removed redundant commands.');
    } catch (error) {
        console.error(error);
    }
})();
