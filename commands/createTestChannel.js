const { SlashCommandBuilder, ChannelType } = require('discord.js'); // Import de ChannelType

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createchannel')
        .setDescription('Crée un salon avec un titre choisi.')
        .addStringOption(option =>
            option.setName('channel_type')
                .setDescription('Le type du salon à créer.')
                .setRequired(true)
                .addChoices(
                    { name: 'Textuel', value: 'text' },
                    { name: 'Vocal', value: 'voice' }
                ))
        .addStringOption(option =>
            option.setName('channel_name')
                .setDescription('Nom du salon à créer.')
                .setRequired(true)
                .setMaxLength(100)),

    async execute(interaction) {
        const channelType = interaction.options.getString('channel_type'); // Récupère le type de salon (textuel ou vocal)
        const channelName = interaction.options.getString('channel_name'); // Récupère le nom du salon

        try {
            let createdChannel;
            if (channelType === 'text') {
                // Crée un salon textuel
                createdChannel = await interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText, // Utilise ChannelType.GuildText pour les salons textuels
                    reason: `Salon créé par la commande /createchannel avec le titre ${channelName}`,
                });
            } else if (channelType === 'voice') {
                // Crée un salon vocal
                createdChannel = await interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildVoice, // Utilise ChannelType.GuildVoice pour les salons vocaux
                    reason: `Salon créé par la commande /createchannel avec le titre ${channelName}`,
                });
            }

            await interaction.reply({
                content: `Salon '${createdChannel.name}' créé avec succès !`,
                flags: 64, // Utilisation de flags pour rendre la réponse éphemère
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "Une erreur est survenue lors de la création du salon.",
                flags: 64, // Réponse éphemère également en cas d'erreur
            });
        }
    }
};
