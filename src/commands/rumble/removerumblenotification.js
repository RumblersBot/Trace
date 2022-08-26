const RumbleNotification = require('../../_database/models/rumbleNotificationSchema')

module.exports = {
    name: "removerumblenotification",
    aliases: ["rrn"],
    category: "rumble",
    cmdpermissions: 10,
    description: 'Removes a Rumble Royale mention notification for a specific role',
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

        let notification = await RumbleNotification.findOne({
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        if (!notification) {
            return await message.reply("No Rumble notification set with the parameters.")
        }

        try {
            await notification.delete()
            await message.reply(`\`${roleID}\` removed from Rumble Royale mention notifications for channel \`${channelID}\`.`)
        } catch (error) {
            addLog(error, error.stack)
        }        
    }
}