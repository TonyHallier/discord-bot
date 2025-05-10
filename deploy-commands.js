const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();
const { guildId } = require('./config.json');  // Assurez-vous que config.json contient la clé guildId

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Charger les commandes depuis les fichiers
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// Créer une instance de REST
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Déployer les commandes sur Discord
(async () => {
    try {
        console.log('🔁 Rafraîchissement des commandes slash...');
        
        // Remplacer '1358890087982694571' par l'ID du bot depuis process.env
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
            { body: commands }
        );

        console.log('✅ Commandes mises à jour.');
    } catch (error) {
        console.error('Erreur lors du déploiement des commandes:', error);
    }
})();
