const { Permissions } = require("discord.js")

module.exports = {
    name: "removebattleping",
    description: "Removes a Battle Ping",
    category: "battleping",
    guilds: ["968176372944109709", "968886418883637278","841882715585904650"],
    cmdpermissions: 10,
    default_member_permissions: Permissions.FLAGS.MANAGE_CHANNELS,
    options: [
        {
            name: "channel",
            description: "The channel on which you want to set it up.",
            type: "CHANNEL",
            required: false
        },
    ],
    run: async ({ client, interaction }) => {
        await interaction.deferReply({ ephemeral: true })

        let channel = interaction.options.getChannel("channel")
        if (!channel) channel = interaction.channel

        const { removeBattlePing } = require('../../functions/battleping')

        removeBattlePing(channel)

        await interaction.editReply({ content: `Battle ping for channel \`${channel.name}\` removed` })
    }
}
