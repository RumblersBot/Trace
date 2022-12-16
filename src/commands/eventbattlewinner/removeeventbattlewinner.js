const EventBattleWinner = require('../../_database/models/eventBattleWinnerSchema')
const { addLog } = require('../../functions/logs')

module.exports = {
    name: "removeeventbattlewinner",
    aliases: ["rebw"],
    category: "eventbattlewinner",
    cmdpermissions: 10,
    description: 'Removes an Event Battle winner role',
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

        let bw = await EventBattleWinner.findOne({
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        if (!bw) {
            return await message.reply("No Event Battle Winner Roles set with the parameters.")
        }

        try {
            await bw.delete()
            await message.reply(`\`${roleID}\` removed from Event Battle Winner Roles for channel \`${channelID}\`.`)
        } catch (error) {
            addLog(message.channel, error, error.stack)
        }
    }
}