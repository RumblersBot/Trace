const AnnouncementSchema = require('../_database/models/announcementSchema')
const mongoose = require('mongoose')
const { addLog } = require('../functions/logs')
let isRunning = false

async function addAnnouncement(bot) {
    var { client, interaction } = bot

    await interaction.deferReply()

    const channel = interaction.options.getChannel("channel")
    const message = interaction.options.getString("message")
    const dayofweek = interaction.options.getInteger("dayofweek")
    const hour = interaction.options.getInteger("hour")
    const minutes = interaction.options.getInteger("minutes") || 0

    const nextRun = calcNextRun(dayofweek, hour, minutes)

    let announcement = await new AnnouncementSchema({
        _id: mongoose.Types.ObjectId(),
        guildID: channel.guild.id,
        channelID: channel.id,
        message: message,
        dayOfWeek: dayofweek,
        hourGMT: hour,
        minutes: minutes,
        nextRun: Math.round(nextRun / 1000)
    })
    await announcement.save().catch(error => addLog(null, error, error.stack))

    if (await skipAnnouncements(client, announcement.nextRun)) client.earliestAnnouncement = announcement.nextRun

    await interaction.editReply(`Announcement created with id \`${announcement._id}\`. Next run on <t:${announcement.nextRun}:F>`)
}
async function removeAnnouncement(bot) {
    var { interaction } = bot

    await interaction.deferReply()

    const id = interaction.options.getString("id")

    await AnnouncementSchema.deleteOne({
        _id: id,
        guildID: interaction.guild.id
    }).catch(error => addLog(null, error, error.stack))

    await interaction.editReply(`Announcement with id \`${id}\` has been deleted.`)
}
async function listAnnouncements(bot) {
    var { interaction } = bot

    await interaction.deferReply()

    const announcements = await AnnouncementSchema.find({
        guildID: interaction.guild.id
    })

    let printData = ""

    for (let index = 0; index < announcements.length; index++) {
        const announcement = announcements[index];

        const nextRun = calcNextRun(announcement.dayOfWeek, announcement.hourGMT, announcement.minutes)

        printData += `\`${announcement._id}\`: <#${announcement.channelID}> - `
        printData += `${nextRun.toLocaleString("en", { weekday: "long" })} at ${announcement.hourGMT}:${announcement.minutes.toString().padStart(2, 0)} (GMT) \n`
        printData += `Next run on <t:${announcement.nextRun}:F> \n`
        printData += `${getMessage(announcement, announcement.nextRun)} \n\n`
    }

    if (printData === "") {
        printData = "No announcement set up on this server."
    } else {
        printData = "**Announcements**:\n" + printData
    }
    await interaction.editReply(printData)
}
async function skipAnnouncements(client, runTime) {
    if (!client.earliestAnnouncement) client.earliestAnnouncement = 0

    if (client.earliestAnnouncement === 0) {
        let earliestAnnouncement = await AnnouncementSchema.find().sort('nextRun').limit(1)
        if (earliestAnnouncement.length === 0)
            client.earliestAnnouncement = 9123456789
        else
            client.earliestAnnouncement = earliestAnnouncement[0].nextRun
    }

    return client.earliestAnnouncement > runTime
}
async function checkIfNeeded(bot) {
    var { client } = bot

    if (isRunning) return
    isRunning = true

    const now = Math.round(new Date() / 1000)
    if (await skipAnnouncements(client, now)) {
        isRunning = false
        return;
    }

    const announcements = await AnnouncementSchema.find({
        nextRun: { $lt: now }
    })

    for (let index = 0; index < announcements.length; index++) {
        const announcement = announcements[index];

        const nextRun = calcNextRun(announcement.dayOfWeek, announcement.hourGMT, announcement.minutes)
        const actualRun = announcement.nextRun
        announcement.nextRun = Math.round(nextRun / 1000)

        await announcement.save().catch(error => addLog(null, error, error.stack))

        await client.guilds.cache.get(announcement.guildID).channels.cache.get(announcement.channelID).send(getMessage(announcement, actualRun))
    }

    client.earliestAnnouncement = 0
    isRunning = false
}
function calcNextRun(dayofweek, hourGMT, minutes) {
    let nextRun = new Date()
    const now = new Date()

    nextRun.setUTCHours(hourGMT)
    nextRun.setUTCMinutes(minutes)
    nextRun.setUTCSeconds(0)
    nextRun.setUTCMilliseconds(0)

    if ((now < nextRun) && (nextRun.getDay() == (dayofweek % 7))) return nextRun

    do {
        nextRun.setDate(nextRun.getDate() + 1)
    } while (nextRun.getDay() !== (dayofweek % 7))

    return nextRun
}

function getMessage(announcement, actualRun) {
    let message = announcement.message

    let checkVar = "%72HRS%"
    if (message.includes(checkVar)) {
        let msgRun = actualRun + (72 * 60 * 60)
        message = message.replace(checkVar, `<t:${msgRun}:F>(<t:${msgRun}:R>)`)
    }
    checkVar = "%48HRS%"
    if (message.includes(checkVar)) {
        let msgRun = actualRun + (48 * 60 * 60)
        message = message.replace(checkVar, `<t:${msgRun}:F>(<t:${msgRun}:R>)`)
    }
    checkVar = "%24HRS%"
    if (message.includes(checkVar)) {
        let msgRun = actualRun + (72 * 60 * 60)
        message = message.replace(checkVar, `<t:${msgRun}:F>(<t:${msgRun}:R>)`)
    }

    message = message.replace("\\n", "\n")
    return message
}

module.exports = {
    name: "announcements",
    addAnnouncement,
    removeAnnouncement,
    listAnnouncements,
    checkIfNeeded,
    calcNextRun
}