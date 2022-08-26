const mongoose = require("mongoose")

const battlePingSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    channelID: String,
    pingRole: String,
    title: String,
    countDown: { type: Number, default: 0 },
    reward: String,
    defaultMessage: String,
    footerMessage: String
})

module.exports = new mongoose.model('BattlePingSchema', battlePingSchema, 'battlePings')