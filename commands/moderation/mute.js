const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('🔇 Mute un membre pour une durée donnée (en secondes).')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Utilisateur à mute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('durée')
                .setDescription('Durée en secondes')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('utilisateur');
        const duration = parseInt(interaction.options.getString('durée'));

        // Vérifie la permission
        if (!interaction.memberPermissions.has(PermissionFlagsBits.MuteMembers)) {
            return interaction.reply({
                content: '⛔ Vous n’avez pas la permission de mute des membres.',
                flags: MessageFlags.Ephemeral
            });
        }

        // Vérifie si le membre est valide
        if (!member || !member.manageable) {
            return interaction.reply({
                content: '⛔ Impossible de mute ce membre.',
                flags: MessageFlags.Ephemeral
            });
        }

        // Applique le mute
        try {
            await member.timeout(duration * 1000);
            await interaction.reply(`${member.user.tag} a été mute pour ${duration} secondes.`);

            // Dé-mute automatiquement après la durée
            setTimeout(() => {
                member.timeout(null).catch(() => {});
            }, duration * 1000);
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: '❌ Une erreur est survenue lors du mute.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
