const PingList = require('../_database/models/pingListSchema')
const PingChannel = require('../_database/models/pingChannelSchema')
const { addLog } = require('./logs')
const mongoose = require('mongoose')

async function getMember(member) {
    let pingUser = await PingList.findOne({
        guildID: member.guild.id,
        userID: member.id
    })
    return pingUser
}

async function addMember(member, delaySec) {
    removeMember(member)

    if (!delaySec)
        delaySec = 30 * 60

    let pingUser = await new PingList({
        _id: mongoose.Types.ObjectId(),
        guildID: member.guild.id,
        userID: member.id,
        entryTimeStamp: Math.round(Date.now() / 1000 + delaySec)
    })
    await pingUser.save().catch(error => console.log(error))
}

async function removeMember(member) {
    let pingUser = await getMember(member)

    if (!pingUser) return

    try {
        await pingUser.delete()
    } catch (error) {
        addLog(error, error.stack)
    }
}

async function removeTimedOutAndGetUserPings(guildID) {
    let removeTrigger = Math.round(Date.now() / 1000)
    await PingList.deleteMany({entryTimeStamp: {$lte: removeTrigger}})

    let pingUsers = await PingList.find({
        guildID: guildID
    });

    let users = []
    await pingUsers.forEach(async user => {
        users.push(`<@${user.userID}>`)
    })

    return users.join(" ")
}

async function isChannelEnabled(guildID, channelID) {
    let channel = await PingChannel.findOne({
        guildID: guildID,
        channelID: channelID
    })

    return (!!channel)
}

module.exports = {
    name: "pinglist",
    addMember,
    removeMember,
    removeTimedOutAndGetUserPings,
    isChannelEnabled,
    getMember
}