const mongoose = require("mongoose")

const rumbleNotificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    channelID: String,
    roleID: String
}, { timestamps: true })

module.exports = new mongoose.model('RumbleNotification', rumbleNotificationSchema, 'rumbleNotifications')