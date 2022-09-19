const Discord = require("discord.js")

module.exports = {
    name: "getshopguilditem",
    description: "Gets a Rumble Shop Guild Item",
    category: "rumbleshop",
    cmdpermissions: 10,
    guilds: ["968886418883637278", "968176372944109709"],
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

        const { getRumbleShopGuildItem } = require('../../functions/rumbleshop')

        let item = await getRumbleShopGuildItem(interaction.guild.id, name)

        if (!item) return await interaction.editReply("Item not set up")

        let embed = new Discord.EmbedBuilder()
            .setColor(Discord.Colors.Blue)
            .setTitle("Rumble Shop Item")
            .addFields({ name: "Name:", value: item.name })
            .addFields({ name: "pingRole:", value: `<@&${item.pingRoleID}>`, inline: true })

        await interaction.editReply({ embeds: [embed] })
    }
}
