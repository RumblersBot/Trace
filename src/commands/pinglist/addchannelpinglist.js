const mongoose = require('mongoose')
const PingChannel = require('../../_database/models/pingChannelSchema')

module.exports = {
    name: "addchannelpinglist",
    aliases: ["acp"],
    category: "pinglist",
    cmdpermissions: 10,
    description: 'Enable the pinglist on a channel',
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

        if (pc) {
            return await message.reply(`Channel \`${channel.name}\` already enabled on the ping list.`)
        }

        pc = await new PingChannel({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            channelID: channelID
        })

        try {
            await pc.save()
            await message.reply(`\`${channel.name}\` enabled for the pinglist.`)
        } catch (error) {
            addLog(error, error.stack)
        }        
    }
}