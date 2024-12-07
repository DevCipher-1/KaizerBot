const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token, prefix } = require('./config.json');
const mongoose = require('./utils/mongo.js');
const CustomCommand = require('./models/CustomCommand');
const AutoResponse = require('./models/AutoResponse');
const ServerStats = require('./models/ServerStats');
const fs = require('fs');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is alive!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.once('ready', () => {
    console.log('Bot is online and ready to serve multiple servers!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        const customCommand = await CustomCommand.findOne({ guildId: interaction.guild.id, name: interaction.commandName });
        if (customCommand) {
            return interaction.reply(customCommand.response);
        }
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Auto responses
    const autoResponse = await AutoResponse.findOne({ guildId: message.guild.id, trigger: message.content.toLowerCase() });
    if (autoResponse) {
        return message.channel.send(autoResponse.response);
    }

    // Command handling
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) {
        const customCommand = await CustomCommand.findOne({ guildId: message.guild.id, name: commandName });
        if (customCommand) {
            return message.channel.send(customCommand.response);
        }
        return;
    }

    try {
        await command.executePrefixed(message, args);
    } catch (error) {
        console.error(error);
        await message.reply('There was an error executing that command!');
    }
});

client.login(token);
