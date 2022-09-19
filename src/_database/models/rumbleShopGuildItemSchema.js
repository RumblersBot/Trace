const mongoose = require("mongoose")

const rumbleShopGuildItemSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    name: String,
    pingRoleID: String
}
)

module.exports = new mongoose.model('RumbleShopGuildItem', rumbleShopGuildItemSchema, 'rumbleShopGuildItems')