const Discord = require("discord.js")
const TeamUser = require('../../_database/models/teamUserSchema')
const { addLog } = require('../../functions/logs')

module.exports = {
    name: "points",
    description: "Manage points",
    category: "tournament",
    cmdpermissions: 20,
    guilds: ["968886418883637278", "968176372944109709"],
    options: [
        {
            name: "add",
            description: "Adds points",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "teamname",
                    description: 'Team name',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "points",
                    description: 'Points to update',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: true
                },
                {
                    name: "user",
                    description: 'Points for user',
                    type: Discord.ApplicationCommandOptionType.User
                }
            ]
        },
        {
            name: "view",
            description: "Views a team points",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "teamname",
                    description: 'Team name to view',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "leaderboard",
            description: "Points Leaderboard",
            type: Discord.ApplicationCommandOptionType.Subcommand
        }
    ],
    run: async (bot) => {
        var { interaction } = bot;
        const { viewTeam, viewLeaderboard } = require("./tournament")
        switch (interaction.options.getSubcommand()) {
            case 'add':
                await addPoints(bot)
                break;
            case 'view':
                await viewTeam(bot)
                break;
            case 'leaderboard':
                await viewLeaderboard(bot)
                break;
        }
    }
}

async function addPoints(bot) {
    var { client, interaction } = bot;
    await interaction.deferReply()

    const teamName = interaction.options.getString("teamname")
    const points = interaction.options.getInteger("points")
    const targetUser = interaction.options.getUser("user")

    let filter = {
        guildID: interaction.guild.id,
        teamName: teamName,
        userID: null
    }

    if (!!targetUser) {
        filter.userID = targetUser.id
    }
    let target = await TeamUser.findOne(filter)

    if (!target && !!targetUser) return await interaction.editReply(`\`${targetUser.username}\` is not found on Team \`${teamName}\`.`)
    if (!target) return await interaction.editReply(`Team \`${teamName}\` is not found.`)

    target.points += points

    try {
        await target.save()
        if (!!targetUser)
            return await interaction.editReply(`\`${points}\` points added to Team \`${teamName}\` - \`${targetUser.username}\`.`)

        return await interaction.editReply(`\`${points}\` points added to Team \`${teamName}\`.`)
    } catch (error) {
        addLog(interaction.channel, error, error.stack)
    }
} 