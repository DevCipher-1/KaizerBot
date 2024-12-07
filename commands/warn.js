const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member in the server')
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('The user to warn')
                  .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                  .setDescription('Reason for warning')
                  .setRequired(false)),
    async execute(interaction) {
        const member = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        await interaction.reply(`Warned ${member.user.tag} for: ${reason}`);
        // You can add logging or storing warnings in the database here
    },
    async executePrefixed(message, args) {
        if (!message.member.permissions.has('KICK_MEMBERS')) { // Adjust permission as needed
            return message.reply('You do not have permissions to warn members!');
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply('You need to specify a user!');

        const reason = args.slice(1).join(' ') || 'No reason provided';

        await message.reply(`Warned ${user.tag} for: ${reason}`);
        // You can add logging or storing warnings in the database here
    },
};
