const BattlePingSchema = require('../_database/models/battlePingSchema')
const RumbleEra = require('../_database/models/rumbleEraSchema')
const { addLog } = require('./logs')
const mongoose = require('mongoose')

async function getBattlePing(channel) {
    let battlePing = await BattlePingSchema.findOne({
        guildID: channel.guild.id,
        channelID: channel.id
    })
    return battlePing
}

async function addBattlePing(channel, pingRole, reward, title, countDown, defaultMessage, footerMessage) {
    removeBattlePing(channel)

    let battlePing = await new BattlePingSchema({
        _id: mongoose.Types.ObjectId(),
        guildID: channel.guild.id,
        channelID: channel.id,
        pingRole: pingRole.id,
        title: title,
        reward: reward,
        countDown: countDown,
        defaultMessage: defaultMessage,
        footerMessage: footerMessage
    })
    await battlePing.save().catch(error => addLog(null, error, error.stack))
}

async function getEras() {
    let eras = await RumbleEra.aggregate(
        [
            {
                $addFields: {
                    name_lc: {
                        $toLower: "$name"
                    },
                    choice: {
                        $concat: ["$emoji", " ", "$name"]
                    }
                }
            },
            {
                $sort: { name_lc: 1 }
            }
        ]
    )

    return eras
}

async function handleAnnouncementChoices(slashCommandsToAnnounce) {
    let eras = await getEras()
    if (eras.length !== 0) {
        let editChoices = eras.map(t => ({ name: t.name_lc, value: t.name }))
        let selectChoices = eras.map(t => ({ name: t.name_lc, value: t.choice }))
        slashCommandsToAnnounce.forEach(cmd => {

            switch (cmd.name) {
                case 'era':
                    cmd.options.forEach(opt => {
                        if (opt.name === 'remove') {
                            opt.options?.forEach(subopt => {
                                if (subopt.name === "name") subopt.choices = editChoices
                            })
                        }
                    })
                    break;
                case 'battleping':
                    cmd.options.forEach(opt => {
                        if (opt.name === "era") opt.choices = selectChoices
                    })
                    break;
            }
        })
    }

    return slashCommandsToAnnounce
}

async function removeBattlePing(channel) {
    let battlePing = await getBattlePing(channel)

    if (!battlePing) return

    try {
        await battlePing.delete()
    } catch (error) {
        addLog(null, error, error.stack)
    }
}

module.exports = {
    name: "pinglist",
    addBattlePing,
    removeBattlePing,
    getBattlePing,
    getEras,
    handleAnnouncementChoices
}