const BattleWinner = require('../../_database/models/battleWinnerSchema')

module.exports = {
    name: "removebattlewinner",
    aliases: ["rbw"],
    category: "battlewinner",
    cmdpermissions: 10,
    description: 'Removes a Battle winner role',
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

        let bw = await BattleWinner.findOne({
            guildID: message.guild.id,
            channelID: channelID,
            roleID: roleID
        })

        if (!bw) {
            return await message.reply("No Battle Winner Roles set with the parameters.")
        }

        try {
            await bw.delete()
            await message.reply(`\`${roleID}\` removed from Battle Winner Roles for channel \`${channelID}\`.`)
        } catch (error) {
            addLog(error, error.stack)
        }        
    }
}