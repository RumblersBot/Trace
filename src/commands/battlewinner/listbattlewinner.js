const Discord = require("discord.js")
const BattleWinner = require('../../_database/models/battleWinnerSchema')

module.exports = {
    name: "listbattlewinner",
    aliases: ["lbw"],
    category: "battlewinner",
    cmdpermissions: 20,
    description: 'Lists all battle winner roles',
    usage: "[channelID]",
    run: async ({ client, message, args }) => {
        let channelID = args[0]

        let bw
        if (!channelID) {
            bw = await BattleWinner.find({
                guildID: message.guild.id
            })
        } else {
            bw = await BattleWinner.find({
                guildID: message.guild.id,
                channelID: channelID
            })
        }

        let printData = []

        await bw.forEach(async entry => {
            const channel = message.guild.channels.cache.get(entry.channelID)
            const channelName = channel.name || entry.channelID
            const role = message.guild.roles.cache.get(entry.roleID)
            const roleName = role.name || entry.roleID
            printData.push([`#${channelName}`, `@${roleName}`])
        })

        if (printData.length === 0) {
            return await message.reply('No Battle Winners set up on server.')
        }

        let embed = new Discord.EmbedBuilder()
            .setColor("#8DC685")
            .setTitle("Battle Winner Roles")
            .setDescription(client.functions.get("functions").autoAlign(printData))

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await message.reply({ embeds: [embed] })
    }
}