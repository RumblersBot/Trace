const Discord = require("discord.js")
const PingChannel = require('../../_database/models/pingChannelSchema')

module.exports = {
    name: "listchannelpinglist",
    aliases: ["lcp"],
    category: "pinglist",
    cmdpermissions: 20,
    description: 'Lists all channels where ping list is enabled',
    usage: "[channelID]",
    run: async ({ client, message, args }) => {
        let channelID = args[0]

        let pc
        if (!channelID) {
            pc = await PingChannel.find({
                guildID: message.guild.id
            })
        } else {
            pc = await PingChannel.find({
                guildID: message.guild.id,
                channelID: channelID
            })
        }

        let printData = []

        await pc.forEach(async entry => {
            printData.push([`<#${entry.channelID}>`])
        })

        if (printData.length === 0) {
            return await message.reply('No channels set up for the ping list.')
        }

        let embed = new Discord.MessageEmbed()
            .setColor("#8DC685")
            .setTitle("Channel on the Ping List")
            .setDescription(printData.join("\n"))

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await message.reply({ embeds: [embed] })
    }
}