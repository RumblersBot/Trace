const mongoose = require("mongoose")

const teamUserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    teamName: String,
    points: { type: Number, default: 0 }
}
)

module.exports = new mongoose.model('TeamUser', teamUserSchema, 'teamUsers')