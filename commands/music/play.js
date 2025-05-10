const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Joue une musique dans ton salon vocal.')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Lien de la musique à jouer')
        .setRequired(true)),
  
  async execute(interaction) {
    const url = interaction.options.getString('url');
    const member = interaction.member;

    if (!member.voice.channel) {
      return interaction.reply({ content: 'Tu dois être dans un salon vocal pour utiliser cette commande.', ephemeral: true });
    }

    const voiceChannel = member.voice.channel;

    try {
      const stream = await play.stream(url);
      const resource = createAudioResource(stream.stream, { inputType: stream.type });
      const player = createAudioPlayer();

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      player.play(resource);
      connection.subscribe(player);

      await interaction.reply(`🎶 Lecture en cours : ${url}`);

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Une erreur est survenue lors de la lecture.', ephemeral: true });
    }
  },
};
