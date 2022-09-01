const PingChannel = require('../../_database/models/pingChannelSchema')
const { addLog } = require("../../functions/logs")

module.exports = {
    name: "removechannelpinglist",
    aliases: ["rcp"],
    category: "pinglist",
    cmdpermissions: 10,
    description: 'Removes a channel from the ping list',
    usage: "[Channel ID]",
    run: async ({ client, message, args }) => {
        let channelID = args[0]
        if (!channelID) {
            channelID = message.channel.id
        }

        const channel = await message.guild.channels.fetch(channelID)

        let pc = await PingChannel.findOne({
            guildID: message.guild.id,
            channelID: channelID
        })

        if (!pc) 
            return await message.reply("No channels set up for the ping list within the parameters.")

        try {
            await pc.delete()
            await message.reply(`\`${channel.name}\` removed from Ping List.`)
        } catch (error) {
            addLog(message.channel, error, error.stack)
        }        
    }
}