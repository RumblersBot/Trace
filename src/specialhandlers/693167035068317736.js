//RumbleBot
const RumbleNotification = require('../_database/models/rumbleNotificationSchema')
const Discord = require("discord.js")
const { removeTimedOutAndGetUserPings, isChannelEnabled } = require('../functions/pinglist')

module.exports = {
    run: async ({ message }) => {
        checkMentions(message)
        checkNewBattle(message)
    }
}

async function checkMentions(message) {
    if (message.mentions.members.size == 0) return
    const member = await message.guild.members.fetch(message.mentions.members.first())

    let notifications = await RumbleNotification.find({
        guildID: message.guild.id,
        channelID: message.channel.id
    })

    await notifications.forEach(async notif => {
        if (member.roles.cache.has(notif.roleID)) {
            const role = await message.guild.roles.fetch(notif.roleID)
            await message.channel.send(`\`${member.displayName}\` is a member of \`${role.name}\`.`)
        }
    })
}

async function checkNewBattle(message) {

    let embeds = message.embeds

    if (!embeds) return
    if (!message.embeds[0]) return

    let embedContent = message.embeds[0].description
    if (!embedContent) return

    if (embedContent.includes("Click the emoji below to join"))
        showPingList(message);

}

async function showPingList(message) {
    let buttons = []
    buttons.push(new Discord.MessageButton().setCustomId(`ping-sub`).setStyle("SUCCESS").setLabel('Subscribe'))
    buttons.push(new Discord.MessageButton().setCustomId(`ping-unsub`).setStyle("DANGER").setLabel('Unsubscribe'))

    if ((await isChannelEnabled(message.guild.id, message.channel.id))) {
        let pl = await removeTimedOutAndGetUserPings(message.guild.id)
        if (!!pl) {
            let pingmsg = await message.channel.send(pl.join(" "))
            await pingmsg.delete

            await message.channel.send(`Notified **${pl.length}** users.`)
        }
        await message.channel.send({
            embeds: [
                new Discord.MessageEmbed().setTitle("Battle Notifier").setDescription("Click the buttons below to get pinged when a new battle is hosted.").setColor("BLUE")
            ],
            components: [
                new Discord.MessageActionRow().addComponents(buttons)
            ]
        })
    }
}