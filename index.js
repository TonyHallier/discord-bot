const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config();
const { guildId, ownerId, moderatorRoleId } = require('./config.json');

const logsDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();

// === Chargement des commandes depuis les sous-dossiers ===
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(folderPath, file));
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }
}

// === Déploiement des commandes ===
const deployCommands = async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        console.log('🔁 Rafraîchissement des commandes slash...');
        await rest.put(
            Routes.applicationGuildCommands(client.application.id, guildId),
            { body: commands }
        );
        console.log('✅ Commandes mises à jour.');
    } catch (error) {
        console.error('❌ Erreur lors du déploiement des commandes :', error);
        logError(error);
    }
};

// === Logger d'erreurs ===
function logError(error) {
    const logPath = path.join(logsDirectory, 'errors.log');
    const timestamp = new Date().toISOString();
    const errorDetails = `\n[${timestamp}] - Erreur :\n${error.message}\nStack Trace:\n${error.stack}\n----------------------------------------\n`;
    fs.appendFileSync(logPath, errorDetails, 'utf8');
}

// === Vérification des permissions ===
const checkPermissions = (interaction, command) => {
    if (['mute', 'unmute', 'clear', 'clearall'].includes(command.data.name)) {
        if (!interaction.member.roles.cache.has(moderatorRoleId)) {
            interaction.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', ephemeral: true });
            return false;
        }
    }

    if (command.data.name === 'refresh' && interaction.user.id !== ownerId) {
        interaction.reply({ content: 'Vous n\'êtes pas autorisé à utiliser cette commande.', ephemeral: true });
        return false;
    }

    return true;
};

client.once('ready', async () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
    await client.application.fetch(); // nécessaire pour client.application.id
    await deployCommands();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        if (!checkPermissions(interaction, command)) return;
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        logError(error);
        await interaction.reply({ content: 'Erreur lors de l’exécution.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
