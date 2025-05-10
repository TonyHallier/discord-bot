const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('🔊 Unmute un membre.')
        .addUserOption(option => option.setName('utilisateur').setDescription('Utilisateur à unmute').setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('utilisateur');

        // Vérifie les permissions de l'utilisateur
        if (!interaction.memberPermissions.has(PermissionFlagsBits.MuteMembers)) {
            return interaction.reply({
                content: '⛔ Vous n’avez pas la permission de unmute des membres.',
                flags: MessageFlags.Ephemeral // Réponse privée
            });
        }

        // Applique le unmute
        try {
            await member.timeout(null);
            await interaction.reply({
                content: `${member.user.tag} a été unmute.`,
                flags: MessageFlags.Ephemeral // Réponse privée
            });
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: '❌ Une erreur est survenue lors du unmute.',
                flags: MessageFlags.Ephemeral // Réponse privée en cas d'erreur
            });
        }
    }
};
