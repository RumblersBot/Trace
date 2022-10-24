const AutoRole = require('../_database/models/autoRoleSchema')
const { addLog } = require('./logs')
const mongoose = require('mongoose')

// Hoster = 1
// Winner = 2

async function getAutoRole(client, message, type, fromCount, role) {
    let autoRole = await AutoRole.findOne({
        guildID: message.guild.id,
        type: type,
        fromCount: fromCount,
        roleID: role.id
    })
    return autoRole
}

async function addAutoRole(client, message, type, fromCount, role) {
    removeAutoRole(client, message, type, fromCount, role)

    let autoRole = await new AutoRole({
        _id: mongoose.Types.ObjectId(),
        guildID: message.guild.id,
        type: type,
        fromCount: fromCount,
        roleID: role.id
    })
    await autoRole.save().catch(error => addLog(message.channel, error))
}

async function removeAutoRole(client, message, type, fromCount, role) {
    let autoRole = await getAutoRole(client, message, type, fromCount, role)

    if (!autoRole) return

    try {
        await autoRole.delete()
    } catch (error) {
        addLog(message.channel, error, error.stack)
    }
}

async function getAutoRoles(client, message, type) {
    let roles = await AutoRole.find({
        guildID: message.guild.id,
        type: type
    }).sort('fromCount')

    let printData = []
    await roles.forEach(async entry => {
        const role = message.guild.roles.cache.get(entry.roleID)
        const roleName = role.name || entry.roleID
        printData.push([`\`${entry.fromCount.toLocaleString()}\``, `@${roleName}`])
    })

    return printData
}

async function checkAutoRoles(client, message, userDBObj, member) {
    let hostRoles = await AutoRole.find({
        guildID: message.guild.id,
        type: 1,
        fromCount: { $lte: userDBObj.hostCount }
    }).sort('fromCount')
    let winRoles = await AutoRole.find({
        guildID: message.guild.id,
        type: 2,
        fromCount: { $lte: userDBObj.winCount }
    }).sort('fromCount')

    let assignedRoles = []
    await hostRoles.forEach(async r => {
        if (!member.roles.cache.has(r.roleID)) {
            member.roles.add(r.roleID)
            const role = message.guild.roles.cache.get(r.roleID)
            const roleName = role.name || entry.roleI
            assignedRoles.push(`\`${roleName}\``)
        }
    })

    let roleMessages = ""

    await winRoles.forEach(async r => {
        if (!member.roles.cache.has(r.roleID)) {
            member.roles.add(r.roleID)
            const role = message.guild.roles.cache.get(r.roleID)
            const roleName = role.name || entry.roleID
            assignedRoles.push(`\`${roleName}\``)
            if (!r.message && r.message !== undefined) {
                roleMessages += `\n${r.message}`
            }
        }
    })

    if (assignedRoles.length === 0) return

    let msg = `Congratulations <@${member.id}> :tada:, you have received the following roles: ${assignedRoles.join(", ")}${roleMessages}`
    await message.channel.send(msg)
}

module.exports = {
    name: "autoroles",
    addAutoRole,
    removeAutoRole,
    checkAutoRoles,
    getAutoRoles
}