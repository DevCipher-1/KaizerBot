const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Assign or remove a role to a user')
        .addRoleOption(option => 
            option.setName('role')
                  .setDescription('The role to assign or remove')
                  .setRequired(true))
        .addUserOption(option => 
            option.setName('user')
                  .setDescription('The user to assign or remove the role from')
                  .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const member = interaction.options.getMember('user');

        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            await interaction.reply(`Removed ${role.name} role from ${member.user.username}.`);
        } else {
            await member.roles.add(role);
            await interaction.reply(`Assigned ${role.name} role to ${member.user.username}.`);
        }
    },
    async executePrefixed(message, args) {
        if (args.length < 2) return message.reply('Usage: !role <role> <user>');
        
        const roleName = args[0];
        const userName = args.slice(1).join(' ');
        const role = message.guild.roles.cache.find(role => role.name === roleName);
        const member = message.guild.members.cache.find(member => member.user.username === userName);

        if (!role || !member) return message.reply('Role or user not found.');

        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            await message.reply(`Removed ${role.name} role from ${member.user.username}.`);
        } else {
            await member.roles.add(role);
            await message.reply(`Assigned ${role.name} role to ${member.user.username}.`);
        }
    },
};
