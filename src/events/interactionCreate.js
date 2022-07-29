const { addLog } = require('../functions/logs')
const { getPermissionLevel } = require("../handlers/permissions")

module.exports = {
    name: "interactionCreate",
    run: async function runAll(bot, interaction) {
        let { client } = bot
        let member = interaction.member
        let userPermLevel = getPermissionLevel(member)

        if (client.functions.get("functions").isDevMode()) {
            if (userPermLevel >= 0) return // only bot owner
        }

        if (interaction.isCommand()) handleSlashCommand(bot, interaction)
        else if (interaction.isButton()) handleButton(bot, interaction)
    }
}

const handleButton = async (bot, interaction) => {
    const { client } = bot

    // "name-param1-param2-..."

    const [name, ...params] = interaction.customId.split('-')

    const button = client.buttons.get(name)

    if (!button) return
    try {
        await button.run(client, interaction, params)
    } catch (error) {
        addLog(error, error.stack)
    }
}

const handleSlashCommand = async (bot, interaction) => {
    const { client } = bot

    if (!interaction.inGuild()) return await interaction.reply({content: "This command can only be used in a server", ephemeral: true})

    const slashcmd = client.slashcommands.get(interaction.commandName)

    if (!slashcmd) return

    let member = interaction.member
    let userPermLevel = getPermissionLevel(member)

    if (client.functions.get("functions").isDevMode()) {
        if (interaction.guild.id !== '968886418883637278') // exclude test server
            if (userPermLevel >= 0) return // only bot owner
    }

    if (slashcmd.guilds !== undefined && !slashcmd.guilds.includes(interaction.guild.id)) {
        return await interaction.reply({content: "Command not available in this guild.", ephemeral: true})
    }    

    if (slashcmd.permissions !== undefined && userPermLevel > slashcmd.permissions) {
        return await interaction.reply({content: "You do not have permission to run this slashcommand.", ephemeral: true})
    }

    try {
        await slashcmd.run({ ...bot, interaction })
    } catch (error) {
        var isSend = false
        var message = `Something went wrong: ${error.message}`
        try {
            await interaction.reply(message)
            isSend = true
        } catch { }
        if (!isSend) {
            try {
                await interaction.editReply(message)
                isSend = true
            } catch { }
        }
        if (!isSend) {
            try {
                await interaction.channel.send(message)
                isSend = true
            } catch { }
        }
        addLog(error, error.stack)
    }
}