//RumbleBot
const RumbleNotification = require('../_database/models/rumbleNotificationSchema')
const Discord = require("discord.js")
const { removeTimedOutAndGetUserPings, isChannelEnabled } = require('../functions/pinglist')
const { resolveMember } = require('../functions/parameters');
const { getSettings } = require('../functions/usersettings');
const { addLog } = require('../functions/logs')
const { ButtonStyle, PermissionFlagsBits } = require('discord.js')

module.exports = {
    run: async ({ client, message }) => {
        if (!client.channelData) client.channelData = new Discord.Collection()

        checkMentions(client, message)
        checkNewBattle(client, message)
        checkShopOutput(client, message)
    },
    checkMentions,
    checkNewBattle,
    showPingList,
    checkShopOutput
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

    let hostReminderUser = client.channelData.get(message.channel.id)
    if (!!hostReminderUser) {
        message.channel.send(`<@${hostReminderUser}>, the game you hosted is finished. Reminding you to host another </battle:1013874374752882819>.`)
        client.channelData.set(message.channel.id, null)
    }
}

async function checkNewBattle(client, message) {
    const origMsg = message
    if (!message.embeds || message.embeds.length === 0) {
        const botPerms = await message.guild.members.me.permissions.has(PermissionFlagsBits.ReadMessageHistory)
        if (!botPerms) {
            if (!(await isChannelEnabled(message.guild.id, message.channel.id))) return;
        }

        try {
            await client.functions.get("functions").delay(2000)
            message = await message.fetch(true)
        } catch (error) {
            addLog(message.channel, error, error.stack)
        }
    }
    let embeds = message.embeds

    if (!embeds) return
    if (!message.embeds[0]) return

    let embedFound = message.embeds[0]

    if (embedFound.description)
        if (embedFound.description.includes("Click the emoji below to join"))
            showPingList(client, message);

    const searchString = "Rumble Royale hosted by"
    if (embedFound.title) {
        if (embedFound.title.includes(searchString)) {

            client.channelData.set(message.channel.id, null)

            let isStaffBattle = false
            if (embedFound.footer) isStaffBattle = embedFound.footer.text.includes("Staff")

            if (!isStaffBattle) {
                const { resolveMember } = require('../functions/parameters');

                let foundUser
                try {
                    foundUser = await resolveMember(message, message.interaction.user.id, false)
                } catch (error) {
                    let userNameMentioned = embedFound.title.substring(searchString.length + 1)
                    foundUser = await resolveMember(message, userNameMentioned, false)
                }

                if (!!foundUser) {
                    if ((await isChannelEnabled(message.guild.id, message.channel.id))) {
                        const userSettings = await getSettings(foundUser)
                        if (!!userSettings.hostReminder) {
                            client.channelData.set(message.channel.id, foundUser.id)
                        }
                    }

                    if (["968176372944109709", "968886418883637278"].includes(message.guild.id)) {
                        let userData = await client.functions.get("functions").getUser(message.guild.id, foundUser.id)
                        userData.hostCount += 1
                        await userData.save().catch(error => addLog(message.channel, error, error.stack))
                        await client.functions.get("autoroles").checkAutoRoles(client, message, userData, foundUser)
                    }
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

            try {
                let pingmsg = await message.channel.send('Notify list: ' + pl.join(" "))
                await pingmsg.delete()
    
            } catch (error) {
                addLog(message.channel, error, error.stack)
            }
            count = pl.length

        }
        try {
            await message.channel.send({
                content: `Notified **${count}** users.`,
                embeds: [
                    new Discord.EmbedBuilder().setTitle("Battle Notifier").setDescription("Click the buttons below to get pinged when a new battle is hosted.").setColor(Discord.Colors.Blue)
                ],
                components: [
                    new Discord.ActionRowBuilder({ components: buttons })
                ]
            })
        } catch (error) {
            addLog(message.channel, error, error.stack)
        }

        if (!!tr && tr.length !== 0) {
            let guildSettings = await client.functions.get("functions").getGuildSettings(message.guild.id)
            if (!!guildSettings.pingExpirationDM) {
                let msg = `Your Rumble Battle Subscription timer has expired in \`${message.guild.name}\`.`
                for (let index = 0; index < tr.length; index++) {
                    const userID = tr[index];
                    let targetMember = await resolveMember(message, userID, false)
                    targetMember.send(msg).catch(err => { })
                }
            } else {
                await message.channel.send({
                    content: tr.map(e => `<@${e}>`).join(" "),
                    embeds: [
                        new Discord.EmbedBuilder().setTitle("Subscription expired").setDescription(`Your subscription timer has expired. You can resubscribe using the buttons above.`).setColor(Discord.Colors.Red)
                    ]
                })
            }
        }

        client.pinglistsLastSent.set(message.channel.id, {
            lastSent: Math.round(Date.now() / 1000)
        })
    }
}

async function checkShopOutput(client, message) {
    if (message.content?.includes("The shop resets")) {
        const { getRumbleShopItem, getRumbleShopGuildItem, setItemRefresh, setLastRefresh, getLastRefresh } = require('../functions/rumbleshop')

        let nextReset = message.content.split('<t:')[1].split(':F>')[0]
        let currReset = await getLastRefresh()
        if (currReset === nextReset) return

        await setLastRefresh(nextReset)

        currReset = nextReset - (60 * 60 * 24) // 1 day

        let currency = {}
        currency['gold'] = '<:gold:1021404281464684695>'
        currency['gems'] = '<:gems:1021404341267091577>'
        let weaponHash = {}

        let embed = message.embeds[0]
        let weaponInfo = embed.fields[2].value.split('\n')
        let msg = `> **🛒 __Shop reset__. Next reset is <t:${nextReset}:F>**\n\n`
        for (let index = 0; index < weaponInfo.length; index++) {
            const weapon = weaponInfo[index];
            let entryNo = weapon.split('\`')[1].trim()
            let entryName = weapon.split('**')[1]
            let costType = weapon.split('-')[1].split(':')[1]
            let cost = weapon.split('>')[2].split('|')[0]

            let item = await getRumbleShopItem(entryName)

            const costImg = currency[costType]
            let lastSeen = 'Not yet seen'
            if (!!item.lastSeen) lastSeen = `<t:${item.lastSeen}:R>`
            await setItemRefresh(entryName, item, currReset)

            let era = ''
            if (!!item.era) era = ` | ${item.era}`
            msg += `\`${entryNo}\` | ${item.image}**${item.name}** - ${cost} ${costImg}%PING${entryNo}%\n`
            msg += `<:reply:1021406614391095390> Last seen: ${lastSeen}${era}\n`

            weaponHash[entryNo] = entryName
        }

        const { getGuildSettings } = require("../functions/functions")
        for (let guild of client.guilds.cache) {
            guild = guild[1]
            const settings = await getGuildSettings(guild.id)
            if (!!settings.shopResetChannelID) {
                let newMsg = msg
                let channel = guild.channels.cache.get(settings.shopResetChannelID)
                for (const key in weaponHash) {
                    let guildItem = await getRumbleShopGuildItem(guild.id, weaponHash[key])
                    if (!guildItem || !guildItem.pingRoleID) {
                        newMsg = newMsg.replace(`%PING${key}%`, "")
                    } else {
                        newMsg = newMsg.replace(`%PING${key}%`, ` - <@&${guildItem.pingRoleID}>`)
                    }
                }
                await channel.send(newMsg)
            }
        }
    }
}