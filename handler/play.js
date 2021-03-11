const ytdlDiscord = require("ytdl-core-discord");
const Discord = require("discord.js")

module.exports.play = async(song, client, message) => {
    const queue = client.queue.get(message.guild.id);
  
    let stream;
    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      return queue.textChannel.send("🚫 Music queue ended.").catch(console.error);
    }

    try {
        stream = await ytdlDiscord(song.url, {
          highWaterMark: 1 << 25, // untuk ngehandle data
          filter: "audioonly", // ngefilter agar hanya audio agar bot tidak berat
          quality: "highestaudio", // agar kualitas audio bagus
        });
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        // masalah di sini lu lupa nambahin client di parameter     
        module.exports.play(queue.songs[0], client, message);
      }

       
    }

    const dispatcher = queue.connection
      .play(stream, { type: "opus" })
      .on("finish", () => {

        if (playingMessage && !playingMessage.deleted)
          playingMessage.delete().catch(console.error);

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], client, message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], client, message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], client, message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      var playingMessage = await queue.textChannel.send(`Now Playing: ${song.title} from ${song.channel}`);
    } catch (error) {
      console.error(error);
    }

    
};
