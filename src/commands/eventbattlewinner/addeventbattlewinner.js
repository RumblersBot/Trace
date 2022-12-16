const mongoose = require('mongoose')
const { addLog } = require('../../functions/logs')
const EventBattleWinner = require('../../_database/models/eventBattleWinnerSchema')

module.exports = {
    name: "addeventbattlewinner",
    aliases: ["aebw"],
    category: "eventbattlewinner",
    cmdpermissions: 10,
    description: 'Add an Event Battle Winner role',
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

        let bw = await EventBattleWinner.findOne({
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        if (bw) {
            return await message.reply(`Role \`${role.name}\` already added for \`${channel.name}\``)
        }

        bw = await new EventBattleWinner({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        try {
            await bw.save()
            await message.reply(`\`${role.name}\` added as Event Battle Winner Role for \`${channel.name}\`.`)
        } catch (error) {
            addLog(message.channel, error, error.stack)
        }
    }
}