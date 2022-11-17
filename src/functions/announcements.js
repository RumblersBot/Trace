const AnnouncementSchema = require('../_database/models/announcementSchema')
const mongoose = require('mongoose')
const { addLog } = require('../functions/logs')

async function addAnnouncement(bot) {
    var { interaction } = bot

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

    let printData = "**Announcements**:\n"

    for (let index = 0; index < announcements.length; index++) {
        const announcement = announcements[index];

        const nextRun = calcNextRun(announcement.dayOfWeek, announcement.hourGMT, announcement.minutes)

        printData += `\`${announcement._id}\`: <#${announcement.channelID}> - `
        printData += `${nextRun.toLocaleString("default", { weekday: "long" })} at ${announcement.hourGMT}:${announcement.minutes.toString().padStart(2, 0)} \n`
        printData += `Next run on <t:${announcement.nextRun}:F> \n`
        printData += `${announcement.message.replace("\\n", "\n")} \n\n`
    }

    await interaction.editReply(printData)
}
async function checkIfNeeded(bot) {
    var { client } = bot

    const now = Math.round(new Date() / 1000)
    const announcements = await AnnouncementSchema.find({
        nextRun: { $lt: now}
    })

    for (let index = 0; index < announcements.length; index++) {
        const announcement = announcements[index];

        const nextRun = calcNextRun(announcement.dayOfWeek, announcement.hourGMT, announcement.minutes)
        announcement.nextRun = Math.round(nextRun / 1000)

        await announcement.save().catch(error => addLog(null, error, error.stack))

        await client.guilds.cache.get(announcement.guildID).channels.cache.get(announcement.channelID).send(announcement.message.replace("\\n","\n"))
    }
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

module.exports = {
    name: "announcements",
    addAnnouncement,
    removeAnnouncement,
    listAnnouncements,
    checkIfNeeded,
    calcNextRun
}