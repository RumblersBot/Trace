const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    name: "setshopguilditem",
    description: "Sets a Rumble Shop Guild Item",
    category: "rumbleshop",
    guilds: ["968886418883637278", "968176372944109709","841882715585904650"],
    cmdpermissions: 10,
    default_member_permissions: PermissionFlagsBits.ManageChannels,
    options: [
        {
            name: "name",
            description: "Item Name",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "pingrole",
            description: "Ping Role",
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],
    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true })

        let name = interaction.options.getString("name")
        let pingRole = interaction.options.getRole("pingrole")

        const { addRumbleShopGuildItem } = require('../../functions/rumbleshop')

        await addRumbleShopGuildItem(interaction.guild.id, name, pingRole.id)

        await interaction.editReply({ content: `Shop Guild Item \`${name}\` updated to \`${pingRole.name}\`` })
    }
}
