const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { ownerId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📘 Liste des commandes disponibles.'),
    
    async execute(interaction) {
        // Assurez-vous que l'interaction n'a pas déjà été répondue
        if (interaction.replied || interaction.deferred) {
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('📘 Commandes disponibles');

        // Catégories de commandes
        const categories = {
            'Utilitaire': [],
            'Modération': [],
            'Propriétaire': []
        };

        // Récupère les commandes et les trie par catégorie
        const commands = [...interaction.client.commands.values()]
            .filter(cmd => cmd.data.name !== 'refresh' || interaction.user.id === ownerId);

        for (const command of commands) {
            if (command.data.name === 'help') continue; // On ne veut pas afficher la commande /help dans /help

            // Vérifie les rôles avant d'ajouter les commandes dans la bonne catégorie
            if (command.data.name === 'google' || command.data.name === 'ping' || command.data.name === 'exemple') {
                categories['Utilitaire'].push(command);
            } else if (command.data.name === 'clear' || command.data.name === 'clearall' || command.data.name === 'mute' || command.data.name === 'unmute') {
                // Vérifier si l'utilisateur a un rôle de modération
                if (interaction.member.roles.cache.some(role => role.name === 'Modérateur')) {
                    categories['Modération'].push(command);
                }
            } else if (command.data.name === 'refresh' && interaction.user.id === ownerId) {
                // Vérifier si l'utilisateur est le propriétaire
                categories['Propriétaire'].push(command);
            }
        }

        // Ajoute chaque catégorie au message
        for (const [category, cmds] of Object.entries(categories)) {
            if (cmds.length > 0) {
                let fieldValue = '';
                for (const command of cmds) {
                    fieldValue += `/${command.data.name} - ${command.data.description || 'Aucune description.'}\n`;
                }

                embed.addFields({
                    name: `**${category}**`,
                    value: fieldValue,
                    inline: false
                });
            }
        }

        // Répond uniquement si l'interaction n'a pas été déjà répondu
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
