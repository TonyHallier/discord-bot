// /commands/google.js
const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('google')
        .setDescription('🔗 Envoie un lien vers Google.'),

    async execute(interaction) {
        try {
            await interaction.reply({
                content: 'Voici le lien vers Google : [Google](https://www.google.com)',
                flags: MessageFlags.Ephemeral // Message visible uniquement par la personne qui exécute la commande
            });
        } catch (error) {
            // Gérer l'erreur et l'enregistrer dans le fichier de logs
            // handleError('google', error);  // Cette partie n'est pas utilisée ici, tu peux la réactiver si nécessaire.

            // Répondre à l'utilisateur avec un message d'erreur
            await interaction.reply({
                content: 'Une erreur est survenue lors de l\'exécution de cette commande.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
