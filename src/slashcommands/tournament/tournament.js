const Discord = require("discord.js")
const mongoose = require("mongoose");
const TeamUser = require('../../_database/models/teamUserSchema')

module.exports = {
    name: "tournament",
    description: "Tournament info",
    category: "tournament",
    guilds: ["968886418883637278", "968176372944109709"],
    options: [
        {
            name: "team",
            description: "Views a team members / points",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "teamname",
                    description: 'Team name to view',
                    type: Discord.ApplicationCommandOptionType.String
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
        switch (interaction.options.getSubcommand()) {
            case 'team':
                await viewTeam(bot)
                break;
            case 'leaderboard':
                await viewLeaderboard(bot)
                break;
        }
    }, 
    viewLeaderboard,
    viewTeam
}

async function viewLeaderboard(bot) {
    var { client, interaction } = bot;
    await interaction.deferReply()

    const imgArr = [":first_place:", ":second_place:", ":third_place:", "", "", "", "", "", "", ""]

    let topTeams = await TeamUser.aggregate([
        {
            $match: {
                guildID: interaction.guild.id
            }
        },
        {
            $group: {
                _id: "$teamName",
                points: { $sum: "$points" }
            }
        },
        {
            $sort: { points: -1 }
        },
        { $limit: 10 }
    ])
    let topUsers = await TeamUser.find({ guildID: interaction.guild.id, userID: { $ne: null } }).sort('-points').limit(10).exec()

    let teamString = ""
    for (let index = 1; index <= 10; index++) {
        let team = topTeams[index - 1]
        if (!!team) {
            teamString += `\`${index.toString().padStart(2, " ")}.\` ${imgArr[index - 1]}**${team._id}**\n${team.points.toLocaleString()} points\n`
        }
    }

    let userString = ""
    for (let index = 1; index <= 10; index++) {
        let user = topUsers[index - 1]
        if (!!user) {
            let member = await getMember(interaction, user.userID)
            userString += `\`${index.toString().padStart(2, " ")}.\` ${imgArr[index - 1]}**${member.displayName}**\n${user.points.toLocaleString()} points\n`
        }
    }

    if (!teamString) teamString = "No teams created"
    if (!userString) userString = "No users on teams"

    let embed = new Discord.EmbedBuilder()
        .setColor(Discord.Colors.Gold)
        .setTitle(`Tournament Leaderboard`)
        .addFields([
            {
                name: "Teams:",
                value: teamString,
                inline: true
            },
            {
                name: "Users:",
                value: userString,
                inline: true
            }
        ])

    embed = client.functions.get("functions").setEmbedFooter(embed, client)

    await interaction.editReply({ embeds: [embed] })
}

async function getMember(interaction, memberID) {
    let member = await interaction.guild.members.cache.get(memberID)
    if (!member)
        member = await interaction.guild.members.fetch(memberID)

    return member
}

async function viewTeam(bot) {
    var { client, interaction } = bot;
    await interaction.deferReply()

    let teamName = interaction.options.getString('teamname')
    let filter = {
        guildID: interaction.guild.id,
        userID: { $ne: null }
    }

    if (!!teamName) {
        filter.teamName = {'$regex' : `^${teamName}$`, '$options' : 'i'}
        const result = (await TeamUser.find(filter)).map(e => `<@${e.userID}> - \`${e.points}\``)
        const teamPoints = await TeamUser.aggregate(
            [
                {
                    $match: {
                        guildID: interaction.guild.id,
                        teamName: {'$regex' : `^${teamName}$`, '$options' : 'i'}
                    }
                },
                {
                    $group: {
                        _id: "$teamName",
                        points: { $sum: "$points" }
                    }
                }
            ]
        )
        let embed = new Discord.EmbedBuilder()
            .setColor(Discord.Colors.Blue)
            .setTitle(`Team: \`${teamName}\``)
            .addFields({ name: 'Total Points', value: `\`${teamPoints[0].points}\`` })
            .addFields({ name: 'Members', value: result.join("\n") })

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        return await interaction.editReply({ embeds: [embed] })
    } else {
        const teams = await TeamUser.aggregate([{ $match: filter }, { $group: { _id: "$teamName", normalized: { $first: { $toLower: "$teamName"}}, members: { $push: { $concat: ["<@", "$userID", ">"] } } } }, { $sort: { normalized: 1 } }])
        let printData = []
        await teams.forEach(async team => {
            printData.push([team._id, team.members.join(", ")])
        })

        if (printData.length === 0) {
            return await interaction.editReply('No teams set up on server.')
        }


        let embed = new Discord.EmbedBuilder()
            .setColor(Discord.Colors.Blue)
            .setTitle("Teams")
            .setDescription(client.functions.get("functions").autoAlign(printData))

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        interaction.editReply({ embeds: [embed] })
    }
}