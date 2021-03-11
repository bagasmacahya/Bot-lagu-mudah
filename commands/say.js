const { MessageEmbed } = require("discord.js");
exports.run = async (client, message, args) => {
  let say = message.content.split(" ").slice(1).join(" ")
  message.delete()
  
     let embed = new MessageEmbed().setDescription(say).setFooter(`${message.author.username}#${message.author.discriminator}`).setTimestamp().setColor("BLUE").setThumbnail(message.author.displayAvatarURL({format: 'png', dynamic: true})+"?size=2048");
  message.channel.send(embed)
}