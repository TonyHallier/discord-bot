const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { roleId } = require('../config.json'); // ID du rôle spécifique pour la modération

// Compteur d'erreurs global
let errorCount = 0;

// Fonction pour loguer les erreurs dans un fichier
function logError(commandName, error) {
    const logPath = path.join(__dirname, '../logs', 'error.log');
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] - Commande: ${commandName} - Erreur: ${error.message}\n`;
    
    fs.appendFileSync(logPath, errorMessage, 'utf8');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('example')
        .setDescription('🔗 Un exemple de commande qui simule une erreur.'),

    async execute(interaction) {
        // Vérifier si l'utilisateur a le rôle spécifié
        if (!interaction.member.roles.cache.has(roleId)) {
            return await interaction.reply({
                content: "Désolé, vous n'avez pas l'autorisation d'utiliser cette commande.",
                flags: MessageFlags.Ephemeral // Message visible uniquement pour la personne qui l'a exécutée
            });
        }

        try {
            // Simuler une erreur à chaque tentative (pour le test)
            throw new Error("Erreur simulée lors de l'exécution de la commande Example");

            // Code de la commande si pas d'erreur
            await interaction.reply({
                content: 'Cette commande ne génère pas d\'erreur.',
                flags: MessageFlags.Ephemeral // Message visible uniquement par la personne qui exécute la commande
            });

        } catch (error) {
            // Incrémenter le compteur d'erreurs
            errorCount++;

            if (errorCount >= 3) {
                // Loguer l'erreur dans un fichier après 3 tentatives
                logError('example', error);

                // Réinitialiser le compteur d'erreurs
                errorCount = 0;

                // Informer l'utilisateur qu'une erreur a eu lieu
                await interaction.reply({
                    content: 'Une erreur est survenue après plusieurs tentatives. Les développeurs ont été informés.',
                    flags: MessageFlags.Ephemeral
                });
            } else {
                // Informer l'utilisateur qu'il y a eu une erreur mais sans loguer
                await interaction.reply({
                    content: `Une erreur est survenue (tentative ${errorCount}/3). Réessayez plus tard.`,
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
};
