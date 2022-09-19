const Discord = require("discord.js")
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js")
const { showPing } = require("./battleping")

module.exports = {
    name: "previewbattleping",
    description: "Previews a Battle Ping",
    category: "battleping",
    guilds: ["968176372944109709", "968886418883637278", "841882715585904650"],
    cmdpermissions: 20,
    //default_member_permissions: PermissionFlagsBits.ManageChannels,
    options: [
        {
            name: "channel",
            description: "channel",
            type: ApplicationCommandOptionType.Channel,
            required: false
        },
    ],
    run: async ({ client, interaction }) => {
        showPing(client, interaction, "<:Classic:1021411565179764807> Classic", '', interaction.options.getChannel("channel") || interaction.channel)
    }
}
