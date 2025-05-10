const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { ownerId } = require('../config.json'); // Assurez-vous que le 'ownerId' est défini dans votre config

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('🏓 Affiche la latence du bot.')
        .setDefaultMemberPermissions(0), // Empêche l'accès aux autres membres
    async execute(interaction) {
        // Vérifier si l'utilisateur est le propriétaire
        if (interaction.user.id !== ownerId) {
            return interaction.reply({
                content: '⛔ Cette commande est réservée au propriétaire du bot.',
                flags: MessageFlags.Ephemeral, // Réponse privée
            });
        }

        // Mettre en attente la réponse pendant que l'on calcule les latences
        const start = Date.now();  // Note l'heure à laquelle l'interaction a été reçue
        await interaction.deferReply();

        // Calcul de la latence du bot et de l'API Discord
        const botLatency = Date.now() - start;  // Calcul de la latence du bot
        const apiLatency = Math.round(interaction.client.ws.ping); // Latence de l'API Discord (ws.ping)

        // Envoi de la réponse une fois le calcul effectué
        await interaction.followUp({
            content: `🏓 Pong! Latence du bot : **${botLatency}ms**\nLatence de l'API Discord : **${apiLatency}ms**`,
            flags: MessageFlags.Ephemeral, // Réponse privée
        });
    }
};
