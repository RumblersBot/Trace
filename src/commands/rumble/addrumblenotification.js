const mongoose = require('mongoose')
const RumbleNotification = require('../../_database/models/rumbleNotificationSchema')

module.exports = {
    name: "addrumblenotification",
    aliases: ["arn"],
    category: "rumble",
    permissions: 10,
    description: 'Add a Rumble Royale mention notification for a specific role to the current channel',
    usage: "[Channel ID] <Role ID>",
    run: async ({ client, message, args }) => {
        let roleID = args[1]
        let channelID = args[0]
        if (!roleID) {
            roleID = channelID
            channelID = message.channel.id
        }

        if (!roleID)
            return await message.reply("Role ID not supplied")

        const role = await message.guild.roles.fetch(roleID)
        const channel = await message.guild.channels.fetch(channelID)

        if (!role)
            return await message.reply("Role not found")

        let notification = await RumbleNotification.findOne({
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        if (notification) {
            return await message.reply(`Role \`${role.name}\` already added for \`${channel.name}\``)
        }

        notification = await new RumbleNotification({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        try {
            await notification.save()
            await message.reply(`\`${role.name}\` added to Rumble Royale mention notifications for \`${channel.name}\`.`)
        } catch (error) {
            addLog(error, error.stack)
        }        
    }
}