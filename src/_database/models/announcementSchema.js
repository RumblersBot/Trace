const mongoose = require("mongoose")

const announcementSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    channelID: String,
    message: String,
    dayOfWeek: Number,
    hourGMT: Number,
    minutes: Number,
    nextRun: Number
})

module.exports = new mongoose.model('Announcement', announcementSchema, 'announcements')