const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
    name: "setshopitem",
    description: "Sets a Rumble Shop Item",
    category: "rumbleshop",
    guilds: ["968886418883637278"],
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
            name: "era",
            description: "Item era",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "image",
            description: "Item Image",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true })

        let name = interaction.options.getString("name")
        let image = interaction.options.getString("image") || ""
        let era = interaction.options.getString("era")

        const { addRumbleShopItem } = require('../../functions/rumbleshop')

        await addRumbleShopItem(name, image, era)

        await interaction.editReply({ content: `Shop Item \`${name}\` updated` })
    }
}
