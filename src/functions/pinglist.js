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
    await removeMember(member)

    if (!delaySec)
        delaySec = 30 * 60

    if (delaySec > 1 * 365 * 24 * 60 * 60) // 1 year
        delaySec = 1 * 365 * 24 * 60 * 60

    let pingUser = await new PingList({
        _id: mongoose.Types.ObjectId(),
        guildID: member.guild.id,
        userID: member.id,
        entryTimeStamp: Math.round(Date.now() / 1000 + delaySec)
    })
    await pingUser.save().catch(error => addLog(null, error, error.stack))

    return pingUser
}

async function removeMember(member) {
    let pingUser = await getMember(member)

    if (!pingUser) return

    try {
        await pingUser.delete()
    } catch (error) {
        addLog(null, error, error.stack)
    }
}

async function removeTimedOutAndGetUserPings(guildID) {
    let removeTrigger = Math.round(Date.now() / 1000)
    let toRemove = await PingList.find({
        guildID: guildID,
        entryTimeStamp: {$lte: removeTrigger}
    })

    await PingList.deleteMany({
        guildID: guildID,
        entryTimeStamp: {$lte: removeTrigger}
    })

    let pingUsers = await PingList.find({
        guildID: guildID
    });

    let usersToRemove = []
    let users = []   
    for (let index = 0; index < toRemove.length; index++) {
        const user = toRemove[index];
        usersToRemove.push(user.userID)
    }

    for (let index = 0; index < pingUsers.length; index++) {
        const user = pingUsers[index];
        users.push(`<@${user.userID}>`)
    }

    return [usersToRemove, users]
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