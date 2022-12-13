const mongoose = require("mongoose")

const rumbleEraSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    emoji: String
}
)

module.exports = new mongoose.model('RumbleEra', rumbleEraSchema, 'rumbleEras')