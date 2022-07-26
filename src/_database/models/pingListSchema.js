const mongoose = require("mongoose")

const pingListSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    entryTimeStamp: String
}
)

module.exports = new mongoose.model('PingList', pingListSchema, 'pingLists')