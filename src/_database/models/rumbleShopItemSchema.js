const mongoose = require("mongoose")

const rumbleShopItemSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    lastSeen: String,
    era: String,
    image: String
}
)

module.exports = new mongoose.model('RumbleShopItem', rumbleShopItemSchema, 'rumbleShopItems')