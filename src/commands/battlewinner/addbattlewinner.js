const mongoose = require('mongoose')
const { addLog } = require('../../functions/logs')
const BattleWinner = require('../../_database/models/battleWinnerSchema')

module.exports = {
    name: "addbattlewinner",
    aliases: ["abw"],
    category: "battlewinner",
    cmdpermissions: 10,
    description: 'Add a Battle Winner role',
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

        let bw = await BattleWinner.findOne({
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        if (bw) {
            return await message.reply(`Role \`${role.name}\` already added for \`${channel.name}\``)
        }

        bw = await new BattleWinner({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        try {
            await bw.save()
            await message.reply(`\`${role.name}\` added as Battle Winner Role for \`${channel.name}\`.`)
        } catch (error) {
            addLog(message.channel, error, error.stack)
        }
    }
}