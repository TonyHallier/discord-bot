const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearall')
        .setDescription('🧹 Nettoie tous les messages dans ce salon.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Permission nécessaire
    async execute(interaction) {
        if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: 'Tu n\'as pas la permission de supprimer des messages.', ephemeral: true });
        }

        try {
            const messages = await interaction.channel.messages.fetch();
            await interaction.channel.bulkDelete(messages, true);
            await interaction.reply({ content: 'Nettoyage complet effectué avec succès dans ce salon.', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue lors du nettoyage du salon.', ephemeral: true });
        }
    }
};
