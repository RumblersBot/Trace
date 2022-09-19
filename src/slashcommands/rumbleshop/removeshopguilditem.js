const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    name: "removeshopguilditem",
    description: "Removes a Rumble Shop Guild Item",
    category: "rumbleshop",
    guilds: ["968886418883637278", "968176372944109709"],
    cmdpermissions: 10,
    default_member_permissions: PermissionFlagsBits.ManageChannels,
    options: [
        {
            name: "name",
            description: "Item Name",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true })

        let name = interaction.options.getString("name")

        const { removeRumbleShopGuildItem } = require('../../functions/rumbleshop')

        await removeRumbleShopGuildItem(interaction.guild.id, name)

        await interaction.editReply({ content: `Shop Guild Item \`${name}\` removed.` })
    }
}
