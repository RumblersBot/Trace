const Discord = require("discord.js")
const mongoose = require("mongoose");
const TeamUser = require('../../_database/models/teamUserSchema')
const { addLog } = require('../../functions/logs')

module.exports = {
    name: "team",
    description: "Manage teams",
    category: "tournament",
    cmdpermissions: 10,
    guilds: ["968886418883637278", "968176372944109709"],
    default_member_permissions: Discord.PermissionFlagsBits.ManageChannels,
    options: [
        {
            name: "add",
            description: "Adds a team",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "newteamname",
                    description: 'New team name',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "rename",
            description: "Rename a team",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "teamname",
                    description: 'Current Team name',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "newteamname",
                    description: 'New team name',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Removes a team",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "teamname",
                    description: 'Team name to remove',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "adduser",
            description: "Adds a user to a team",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "teamname",
                    description: 'Team name',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "user",
                    description: 'User to add',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: "removeuser",
            description: "Removes a user from a team",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: 'User to remove',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: "view",
            description: "Views a team",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "teamname",
                    description: 'Team name to view',
                    type: Discord.ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: "reset",
            description: "resets all teams",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "confirmation",
                    description: "type DELETE in caps to confirm delete all teams",
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    run: async (bot) => {
        var { interaction } = bot;
        switch (interaction.options.getSubcommand()) {
            case 'add':
                await addTeam(bot)
                break;
            case 'remove':
                await removeTeam(bot)
                break;
            case 'adduser':
                await addUser(bot);
                break;
            case 'removeuser':
                await removeUser(bot);
                break;
            case 'view':
                const { viewTeam } = require('./tournament')
                await viewTeam(bot)
                break;
            case 'rename':
                await renameTeam(bot);
                break;
            case 'reset':
                await resetTeams(bot)
                break;
        }
    },
    getTeam
}

async function resetTeams(bot) {
    var { client, interaction } = bot;
    await interaction.deferReply()

    const confirmation = interaction.options.getString('confirmation')
    if (confirmation !== 'DELETE') {
        return await interaction.editReply("Confirmation incorrect, cancelled")
    }

    await TeamUser.deleteMany({
        guildID: interaction.guild.id
    })

    interaction.editReply({ content: `All teams / points removed.` })
    // await client.announceSlashCommands(bot, interaction.guild.id, false)
}

async function renameTeam(bot) {
    var { client, interaction } = bot;
    await interaction.deferReply()

    const teamName = interaction.options.getString('teamname')
    const newTeamName = interaction.options.getString('newteamname')

    await TeamUser.updateMany({
        guildID: interaction.guild.id,
        teamName: { '$regex': teamName, '$options': 'i' }
    }, {
        $set: {
            teamName: newTeamName
        }
    })

    await interaction.editReply({ content: `Team \`${teamName}\` renamed to \`${newTeamName}\`` })
    // await client.announceSlashCommands(bot, interaction.guild.id, false)
}

async function addTeam(bot) {
    var { client, interaction } = bot;
    await interaction.deferReply()

    const teamName = interaction.options.getString('newteamname')

    let teamUser = await getTeam(interaction.guild.id, teamName)

    if (!!teamUser) {
        return await interaction.editReply(`Team \`${teamName}\` already exists.`)
    }

    teamUser = await new TeamUser({
        _id: mongoose.Types.ObjectId(),
        guildID: interaction.guild.id,
        userID: null,
        teamName: teamName
    })

    try {
        await teamUser.save()
        await interaction.editReply({ content: `Team \`${teamName}\` created` })

        // await client.announceSlashCommands(bot, interaction.guild.id, false)
    } catch (error) {
        addLog(interaction.channel, error, error.stack)
    }
}

async function addUser(bot) {
    var { interaction } = bot;
    await interaction.deferReply()

    const teamName = interaction.options.getString('teamname')
    let targetUser = interaction.options.getUser('user')

    let foundTeam = await getTeam(interaction.guild.id, teamName)
    if (!foundTeam) {
        return await interaction.editReply(`Team \`${teamName}\` not found.`)
    }

    let teamUser = await TeamUser.findOne({
        guildID: interaction.guild.id,
        userID: targetUser.id
    })

    if (!!teamUser) {
        return await interaction.editReply(`User \`${targetUser.username}\` is already a member of Team \`${foundTeam}\`.`)
    }

    teamUser = await new TeamUser({
        _id: mongoose.Types.ObjectId(),
        guildID: interaction.guild.id,
        userID: targetUser.id,
        teamName: foundTeam
    })

    try {
        await teamUser.save()
        await interaction.editReply({ content: `User \`${targetUser.username}\` added to Team \`${foundTeam}\`.` })
    } catch (error) {
        addLog(interaction.channel, error, error.stack)
    }
}

async function removeTeam(bot) {
    var { client, interaction } = bot;
    await interaction.deferReply()

    const teamName = interaction.options.getString('teamname')

    let foundTeam = await getTeam(interaction.guild.id, teamName)
    if (!foundTeam) {
        return await interaction.editReply(`Team \`${teamName}\` not found.`)
    }    

    await TeamUser.deleteMany({
        guildID: interaction.guild.id,
        teamName: foundTeam
    })

    interaction.editReply({ content: `\`${teamName}\` was removed.` })

    // await client.announceSlashCommands(bot, interaction.guild.id, false)
}

async function removeUser(bot) {
    var { interaction } = bot;
    await interaction.deferReply()

    const targetUser = interaction.options.getUser('user')

    const filter = {
        guildID: interaction.guild.id,
        userID: targetUser.id
    }

    let foundUser = await TeamUser.findOne(filter)

    if (!!foundUser) {

        await TeamUser.deleteMany(filter)

        interaction.editReply({ content: `\`${targetUser.username}\` was removed from team \`${foundUser.teamName}\`.` })
    }
}

async function resetTeams(bot) {
    var { client, interaction } = bot;
    await interaction.deferReply()

    const teamName = interaction.options.getString('teamname')

    await TeamUser.deleteMany({
        guildID: interaction.guild.id
    })

    interaction.editReply({ content: `All teams removed.` })

    // await client.announceSlashCommands(bot, interaction.guild.id, false)
}

async function getTeam(guildID, teamName) {
    const filter = {
        guildID: guildID,
        userID: null,
        teamName: { '$regex': teamName, '$options': 'i' }
    }

    let foundTeam = await TeamUser.findOne(filter)
    return foundTeam?.teamName
}
