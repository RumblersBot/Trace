const Discord = require("discord.js")
const mongoose = require("mongoose");
const RumbleEra = require('../../_database/models/rumbleEraSchema')

module.exports = {
    name: "era",
    description: "Manage Rumble Eras",
    category: "battleping",
    guilds: ["968176372944109709", "968886418883637278", "841882715585904650"],
    cmdpermissions: 0,
    options: [
        {
            name: "add",
            description: "Adds an era",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: 'New era name',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "emoji",
                    description: 'Emoji to show',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Removes an era",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: 'Era name to remove',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "list",
            description: "Lists all eras",
            type: Discord.ApplicationCommandOptionType.Subcommand,
        },
    ],
    run: async (bot) => {
        var { interaction } = bot;
        switch (interaction.options.getSubcommand()) {
            case 'add':
                await addEra(bot)
                break;
            case 'remove':
                await removeEra(bot)
                break;
            case 'list':
                await listEras(bot);
                break;
        }
    }
}

async function addEra(bot) {
    var { client, interaction } = bot;
    await interaction.deferReply()

    const eraName = interaction.options.getString('name')
    const emoji = interaction.options.getString('emoji')

    let era = await getEra(eraName)

    if (!!era) {
        return await interaction.editReply(`Era \`${eraName}\` already exists.`)
    }

    era = await new RumbleEra({
        _id: mongoose.Types.ObjectId(),
        name: eraName,
        emoji: emoji
    })

    try {
        await era.save()
        await interaction.editReply({ content: `Era \`${eraName}\` created` })

        await client.announceSlashCommands(bot, null, false)
    } catch (error) {
        addLog(interaction.channel, error, error.stack)
    }
}

async function removeEra(bot) {
    var { client, interaction } = bot;
    await interaction.deferReply()

    const eraName = interaction.options.getString('name')

    let foundEra = await getEra(eraName)
    if (!foundEra) {
        return await interaction.editReply(`Era \`${eraName}\` not found.`)
    }

    await RumbleEra.deleteMany({
        name: foundEra
    })

    interaction.editReply({ content: `\`${eraName}\` was removed.` })

    await client.announceSlashCommands(bot, null, false)
}

async function listEras(bot) {
    var { client, interaction } = bot;
    await interaction.deferReply()

    let eraName = interaction.options.getString('eraname')

    const eras = await RumbleEra.find()
    let printData = []
    await eras.forEach(async era => {
        printData.push(`${era.emoji} ${era.name}`)
    })

    if (printData.length === 0) {
        return await interaction.editReply('No eras set up.')
    }


    let embed = new Discord.EmbedBuilder()
        .setColor(Discord.Colors.Blue)
        .setTitle("Eras")
        .setDescription(printData.join('\n'))

    embed = client.functions.get("functions").setEmbedFooter(embed, client)

    interaction.editReply({ embeds: [embed] })
}

async function getEra(eraName) {
    const filter = {
        name: { '$regex': `^${eraName}$`, '$options': 'i' }
    }

    let foundEra = await RumbleEra.findOne(filter)
    return foundEra?.name
}
