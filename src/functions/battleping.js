const BattlePingSchema = require('../_database/models/battlePingSchema')
const { addLog } = require('./logs')
const mongoose = require('mongoose')

async function getBattlePing(channel) {
    let battlePing = await BattlePingSchema.findOne({
        guildID: channel.guild.id,
        channelID: channel.id
    })
    return battlePing
}

async function addBattlePing(channel, pingRole, reward, title, countDown, defaultMessage, footerMessage) {
    removeBattlePing(channel)

    let battlePing = await new BattlePingSchema({
        _id: mongoose.Types.ObjectId(),
        guildID: channel.guild.id,
        channelID: channel.id,
        pingRole: pingRole.id,
        title: title,
        reward: reward,
        countDown: countDown,
        defaultMessage: defaultMessage,
        footerMessage: footerMessage
    })
    await battlePing.save().catch(error => addLog(error))
}

async function removeBattlePing(channel) {
    let battlePing = await getBattlePing(channel)

    if (!battlePing) return

    try {
        await battlePing.delete()
    } catch (error) {
        addLog(error, error.stack)
    }
}

module.exports = {
    name: "pinglist",
    addBattlePing,
    removeBattlePing,
    getBattlePing
}