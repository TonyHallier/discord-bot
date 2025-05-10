const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('🧹 Supprime un nombre spécifié de messages (maximum 1000).')
        .addIntegerOption(option => 
            option.setName('nombre')
                .setDescription('Le nombre de messages à supprimer')
                .setRequired(true)
                .setMaxValue(1000)
                .setMinValue(1)
        ),
    async execute(interaction) {
        const numberOfMessages = interaction.options.getInteger('nombre');

        if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: 'Tu n\'as pas la permission de supprimer des messages.', ephemeral: true });
        }

        try {
            await interaction.channel.bulkDelete(numberOfMessages, true); // 'true' pour permettre la suppression des messages jusqu'à 14 jours
            await interaction.reply({ content: `${numberOfMessages} messages ont été supprimés avec succès.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue lors de la suppression des messages.', ephemeral: true });
        }
    }
};
