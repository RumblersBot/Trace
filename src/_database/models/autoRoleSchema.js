const mongoose = require("mongoose")

const autoRoleSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    type: Number,
    fromCount: Number,
    roleID: String
})

module.exports = new mongoose.model('AutoRole', autoRoleSchema, 'autoRoles')