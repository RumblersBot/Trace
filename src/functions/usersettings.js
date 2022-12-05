const Discord = require("discord.js")
const GlobalUserSchema = require('../_database/models/globalUserSchema')
//const UserSchema = require('../_database/models/userSchema')
const mongoose = require('mongoose')
const { addLog } = require('../functions/logs')
const { resolveMember } = require('../functions/parameters');

async function getSettings(member) {
    let newUser
    let userObj
    try {
        newUser = await new GlobalUserSchema({
            _id: mongoose.Types.ObjectId(),
            userID: member.id
        })
        userObj = await GlobalUserSchema.findOne({
            userID: member.id
        })
    } catch (error) {
        addLog(null, error, error.stack)
        return newUser
    }
    if (!userObj) {
        userObj = newUser
        await userObj.save().catch(error => {
            addLog(null, error, error.stack)
        })
    }

    return userObj

}

function getViewEmbed(member, globalUserSettings) {

    let embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${member.displayName}'s settings`, iconURL: member.displayAvatarURL({ format: 'png', size: 512 }) })
        .setColor(Discord.Colors.Purple)
        .addFields([
            {
                name: "Host Reminder:",
                value: `\`${globalUserSettings.hostReminder || false}\``,
                inline: true
            }
        ])

    return embed
}
async function viewSettings(bot) {
    var { interaction } = bot

    await interaction.deferReply()
    let member = await resolveMember(interaction, interaction.options.getUser("member")?.id, true)

    const globalUserSettings = await getSettings(member)

    await interaction.editReply({ embeds: [getViewEmbed(member, globalUserSettings)] })
}

async function editSettings(bot) {
    var { interaction } = bot

    await interaction.deferReply({ ephemeral: true })

    const member = interaction.member
    let globalUserSettings = await getSettings(member)

    globalUserSettings.hostReminder = interaction.options.getBoolean("hostreminder") || false

    globalUserSettings.save().catch(error => addLog(interaction.channel, error, error.stack))

    await interaction.editReply({ embeds: [getViewEmbed(member, globalUserSettings)] })
}

module.exports = {
    name: "usersettings",
    getSettings,
    viewSettings,
    editSettings
}