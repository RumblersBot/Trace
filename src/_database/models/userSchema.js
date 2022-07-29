const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    hostCount: { type: Number, default: 0 },
    winCount: { type: Number, default: 0 }
}
)

module.exports = new mongoose.model('User', userSchema, 'users')