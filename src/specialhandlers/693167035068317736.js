//RumbleBot
const RumbleNotification = require('../_database/models/rumbleNotificationSchema')
const Discord = require("discord.js")
const { removeTimedOutAndGetUserPings, isChannelEnabled } = require('../functions/pinglist')

module.exports = {
    run: async ({ client, message }) => {
        checkMentions(message)
        checkNewBattle(client, message)
    },
    checkMentions,
    checkNewBattle,
    showPingList
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

async function checkNewBattle(client, message) {

    let embeds = message.embeds

    if (!embeds) return
    if (!message.embeds[0]) return

    let embedContent = message.embeds[0].description
    if (!embedContent) return

    if (embedContent.includes("Click the emoji below to join"))
        showPingList(client, message);

}

async function showPingList(client, message) {
    let buttons = []
    await client.functions.get("functions").delay(2000)
    buttons.push(new Discord.MessageButton().setCustomId(`ping-sub`).setStyle("SUCCESS").setLabel('Subscribe'))
    buttons.push(new Discord.MessageButton().setCustomId(`ping-unsub`).setStyle("DANGER").setLabel('Unsubscribe'))

    if ((await isChannelEnabled(message.guild.id, message.channel.id))) {
        let result = await removeTimedOutAndGetUserPings(message.guild.id)
        let tr = result[0]
        let pl = result[1]
        let count = 0
        if (!!pl && pl.length !== 0) {
            let pingmsg = await message.channel.send('Notify list: ' + pl.join(" "))
            await pingmsg.delete()

            count = pl.length

        }
        await message.channel.send({
            content: `Notified **${count}** users.`,
            embeds: [
                new Discord.MessageEmbed().setTitle("Battle Notifier").setDescription("Click the buttons below to get pinged when a new battle is hosted.").setColor("BLUE")
            ],
            components: [
                new Discord.MessageActionRow().addComponents(buttons)
            ]
        })
        if (!!tr && tr.length !== 0) {
            await message.channel.send({
                content: tr.join(" "),
                embeds: [
                    new Discord.MessageEmbed().setTitle("Subscription expired").setDescription(`Your subscription timer has expired. You can resubscribe using the buttons above.`).setColor("RED")
                ]
            })
        }
    }
}