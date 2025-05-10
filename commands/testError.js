const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testerror')
        .setDescription('Commande pour générer une erreur et tester les logs.'),
    async execute(interaction) {
        throw new Error('Ceci est une fausse erreur générée pour le test !');
    }
};
