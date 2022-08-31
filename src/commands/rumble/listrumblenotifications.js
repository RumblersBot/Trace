const Discord = require("discord.js")
const RumbleNotification = require('../../_database/models/rumbleNotificationSchema')

module.exports = {
    name: "listrumblenotifications",
    aliases: ["lrn"],
    category: "rumble",
    cmdpermissions: 20,
    description: 'Lists a Rumble Royale mention notification for a specific role',
    usage: "[channelID]",
    run: async ({ client, message, args }) => {
        let channelID = args[0]

        let notifications
        if (!channelID) {
            notifications = await RumbleNotification.find({
                guildID: message.guild.id
            })
        } else {
            notifications = await RumbleNotification.find({
                guildID: message.guild.id,
                channelID: channelID
            })
        }

        let printData = []

        await notifications.forEach(async notif => {
            const channel = message.guild.channels.cache.get(notif.channelID)
            const channelName = channel.name || notif.channelID
            const role = message.guild.roles.cache.get(notif.roleID)
            const roleName = role.name || notif.roleID
            printData.push([`#${channelName}`, `@${roleName}`])
        })

        if (printData.length === 0) {
            return await message.reply('No Rumble notifications set up on server.')
        }

        let embed = new Discord.EmbedBuilder()
            .setColor("#8DC685")
            .setTitle("Rumble Royale Notifications")
            .setDescription(client.functions.get("functions").autoAlign(printData))

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await message.reply({ embeds: [embed] })
    }
}