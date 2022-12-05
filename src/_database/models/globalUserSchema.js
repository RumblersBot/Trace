const mongoose = require("mongoose")

const globalUserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    hostReminder: Boolean
}
)

module.exports = new mongoose.model('GlobalUser', globalUserSchema, 'globalUsers')