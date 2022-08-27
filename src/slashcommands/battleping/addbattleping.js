const { Permissions } = require("discord.js")

module.exports = {
    name: "addbattleping",
    description: "Adds a Battle Ping",
    category: "battleping",
    guilds: ["968176372944109709", "968886418883637278","841882715585904650"],
    cmdpermissions: 10,
    default_member_permissions: Permissions.FLAGS.MANAGE_CHANNELS,
    options: [
        {
            name: "pingrole",
            description: "The role to ping.",
            type: "ROLE",
            required: true
        },
        {
            name: "reward",
            description: "The win reward.",
            type: "STRING",
            required: true
        },
        {
            name: "defaultmessage",
            description: "The Default message.",
            type: "STRING",
            required: true
        },
        {
            name: "footermessage",
            description: "The footer message (always shown).",
            type: "STRING",
            required: false
        },
        {
            name: "title",
            description: "The title.",
            type: "STRING",
            required: false
        },
        {
            name: "channel",
            description: "The channel on which you want to set it up.",
            type: "CHANNEL",
            required: false
        },
        {
            name: "countdown",
            description: "Countdown in minutes. Don't supply if not needed",
            type: "INTEGER",
            required: false
        },
    ],
    run: async ({ client, interaction }) => {
        await interaction.deferReply({ ephemeral: true })

        let channel = interaction.options.getChannel("channel")
        if (!channel) channel = interaction.channel

        let pingrole = interaction.options.getRole("pingrole")
        let reward = interaction.options.getString("reward")
        let title = interaction.options.getString("title")
        let countDown = interaction.options.getInteger("countdown") || 0
        let defaultMessage = interaction.options.getString("defaultmessage")
        let footerMessage = interaction.options.getString("footermessage")

        const { addBattlePing } = require('../../functions/battleping')

        await addBattlePing(channel, pingrole, reward, title, countDown, defaultMessage, footerMessage)

        await interaction.editReply({ content: `Battle ping for channel \`${channel.name}\` updated` })
    }
}
