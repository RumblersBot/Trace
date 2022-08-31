const pjson = require("../../../package.json");
const Discord = require("discord.js")
const os = require("os")

module.exports = {
    name: "botinfo",
    category: "info",
    description: 'Displays bot info',
    run: async ({ client, message }) => {
        const botMember = await message.guild.members.fetch(client.user.id)
        let botembed = new Discord.EmbedBuilder()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle("About this bot:")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription("**T**he **R**umblers **A**ssistant **C**omputer **E**ntity")
            .setColor("#800080")
            .addFields({ name: "Bot name:", value: client.user.username, inline: true })
            .addFields({ name: "Version:", value: `${pjson.version} ${pjson.codeName}`, inline: true })
            .addFields({ name: "Created by:", value: "MagnoBE", inline: true })
            .addFields({ name: "Created on", value: `<t:${Math.round(client.user.createdTimestamp / 1000)}:F>`, inline: true })
            .addFields({ name: "On the server since:", value: `<t:${Math.round(botMember.joinedTimestamp / 1000)}:F>`, inline: true })
            .addFields({ name: "Guilds Using this bot: ", value: `\`${client.guilds.cache.size}\``, inline: true })
            .addFields({ name: "Uptime: ", value: client.functions.get("functions").formatTime(client.uptime), inline: true })

        botembed = client.functions.get("functions").setEmbedFooter(botembed, client)

        return await message.reply({ embeds: [botembed] });
    }
}
