const mongoose = require("mongoose")

const rumbleShopSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    lastReset: String
}
)

module.exports = new mongoose.model('RumbleShop', rumbleShopSchema, 'rumbleShops')