const mongoose = require("mongoose")

const pingChannelSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    channelID: String
})

module.exports = new mongoose.model('PingChannel', pingChannelSchema, 'pingChannels')