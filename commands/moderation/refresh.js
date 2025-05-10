const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { ownerId, guildId } = require('../../config.json');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refresh')
        .setDescription('♻️ Met à jour les commandes du bot.')
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        // Vérification des permissions
        if (interaction.user.id !== ownerId)
            return interaction.reply({
                content: 'Tu n\'as pas la permission.',
                flags: MessageFlags.Ephemeral
            });

        const commandsPath = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        const commands = [];

        // Charge les commandes depuis le dossier
        for (const file of commandFiles) {
            const command = require(`./${file}`);
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

        try {
            // Envoie les commandes à Discord pour les mettre à jour
            await rest.put(Routes.applicationGuildCommands(interaction.client.user.id, guildId), {
                body: commands
            });

            await interaction.reply({
                content: 'Commandes mises à jour avec succès.',
                flags: MessageFlags.Ephemeral // Réponse privée
            });
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: 'Erreur pendant la mise à jour.',
                flags: MessageFlags.Ephemeral // Réponse privée en cas d’erreur
            });
        }
    }
};
