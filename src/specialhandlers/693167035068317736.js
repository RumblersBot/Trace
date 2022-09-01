//RumbleBot
const RumbleNotification = require('../_database/models/rumbleNotificationSchema')
const Discord = require("discord.js")
const { removeTimedOutAndGetUserPings, isChannelEnabled } = require('../functions/pinglist')
const { addLog } = require('../functions/logs')
const { ButtonStyle, PermissionFlagsBits } = require('discord.js')

module.exports = {
    run: async ({ client, message }) => {
        checkMentions(client, message)
        checkNewBattle(client, message)
    },
    checkMentions,
    checkNewBattle,
    showPingList
}

async function checkMentions(client, message) {
    if (message.mentions.members.size == 0) return
    const member = await message.guild.members.fetch(message.mentions.members.first())

    if (["968176372944109709", "968886418883637278"].includes(message.guild.id)) {
        let userData = await client.functions.get("functions").getUser(message.guild.id, member.id)
        userData.winCount += 1
        await userData.save().catch(error => addLog(message.channel, error, error.stack))
        await client.functions.get("autoroles").checkAutoRoles(client, message, userData, member)
    }

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
    // if (!message.embeds || message.embeds.size == 0) {
        // const botPerms = await message.guild.me.permissions.has(PermissionFlagsBits.ReadMessageHistory)
        // if (!botPerms) {
        //     if (!(await isChannelEnabled(message.guild.id, message.channel.id))) return;
        // }

        try {
            await client.functions.get("functions").delay(2000)
            message = await message.fetch(true)
        } catch (error) {
            addLog(message.channel, error, error.stack)
        }
    // }
    let embeds = message.embeds

    if (!embeds) return
    if (!message.embeds[0]) return

    let embedFound = message.embeds[0]

    if (embedFound.description)
        if (embedFound.description.includes("Click the emoji below to join"))
            showPingList(client, message);


    if (["968176372944109709", "968886418883637278"].includes(message.guild.id)) {
        const searchString = "Rumble Royale hosted by"
        if (embedFound.title)
            if (embedFound.title.includes(searchString)) {

                let isStaffBattle = false
                if (embedFound.footer) isStaffBattle = embedFound.footer.text.includes("Staff")

                if (!isStaffBattle) {
                    const { resolveMember } = require('../functions/parameters');

                    let userNameMentioned = embedFound.title.substring(searchString.length + 1)
                    let foundUser = await resolveMember(message, userNameMentioned, false)
                    if (!!foundUser) {
                        let userData = await client.functions.get("functions").getUser(message.guild.id, foundUser.id)
                        userData.hostCount += 1
                        await userData.save().catch(error => addLog(message.channel, error, error.stack))
                        await client.functions.get("autoroles").checkAutoRoles(client, message, userData, foundUser)
                    }
                }
            }
    }
}

async function showPingList(client, message) {
    let buttons = []

    const lastPingSent = client.pinglistsLastSent.get(message.channel.id)
    if (!!lastPingSent) {
        const checkTime = Math.round(Date.now() / 1000) - 20
        if (lastPingSent.lastSent >= checkTime) return
    }

    buttons.push(new Discord.ButtonBuilder().setCustomId(`ping-sub`).setStyle(ButtonStyle.Success).setLabel('Subscribe'))
    buttons.push(new Discord.ButtonBuilder().setCustomId(`ping-unsub`).setStyle(ButtonStyle.Danger).setLabel('Unsubscribe'))

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
                new Discord.EmbedBuilder().setTitle("Battle Notifier").setDescription("Click the buttons below to get pinged when a new battle is hosted.").setColor(Discord.Colors.Blue)
            ],
            components: [
                new Discord.ActionRowBuilder().addComponents(buttons)
            ]
        })
        if (!!tr && tr.length !== 0) {
            await message.channel.send({
                content: tr.join(" "),
                embeds: [
                    new Discord.EmbedBuilder().setTitle("Subscription expired").setDescription(`Your subscription timer has expired. You can resubscribe using the buttons above.`).setColor(Discord.Colors.Red)
                ]
            })
        }

        client.pinglistsLastSent.set(message.channel.id, {
            lastSent: Math.round(Date.now() / 1000)
        })
    }
}