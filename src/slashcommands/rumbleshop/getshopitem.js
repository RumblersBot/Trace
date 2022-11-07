const Discord = require("discord.js")

module.exports = {
    name: "getshopitem",
    description: "Gets a Rumble Shop Item",
    category: "rumbleshop",
    cmdpermissions: 10,
    guilds: ["968886418883637278", "968176372944109709","841882715585904650"],
    default_member_permissions: Discord.PermissionFlagsBits.ManageChannels,
    options: [
        {
            name: "name",
            description: "Item Name",
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true })

        let name = interaction.options.getString("name")

        const { getRumbleShopItem } = require('../../functions/rumbleshop')

        let item = await getRumbleShopItem(name)

        if (!item) return await interaction.editReply("Unknown Item")

        let lastSeen = '`Not yet seen`'
        if (!!item.lastSeen) lastSeen = `<t:${item.lastSeen}:R>`

        let embed = new Discord.EmbedBuilder()
            .setColor(Discord.Colors.Blue)
            .setTitle("Rumble Shop Item")
            .addFields({ name: "Name:", value: item.name })
            .addFields({ name: "Image:", value: item.image || '`Not set`', inline: true })
            .addFields({ name: "Era:", value: item.era || '`Not set`', inline: true })
            .addFields({ name: "Last Seen:", value: lastSeen })

        await interaction.editReply({ embeds: [embed] })
    }
}
