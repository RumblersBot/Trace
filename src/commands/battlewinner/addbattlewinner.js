const mongoose = require('mongoose')
const BattleWinner = require('../../_database/models/battleWinnerSchema')

module.exports = {
    name: "addbattlewinner",
    aliases: ["abw"],
    category: "battlewinner",
    permissions: 10,
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

        if (!role)
            return await message.reply("Role not found")

        let bw = await BattleWinner.findOne({
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        if (bw) {
            return await message.reply(`Role \`${role.name}\` already added for this channel`)
        }

        bw = await new BattleWinner({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        try {
            await bw.save()
            await message.reply(`\`${role.name}\` added as Battle Winner Role.`)
        } catch (error) {
            addLog(error, error.stack)
        }        
    }
}