const Discord = require("discord.js")

module.exports = {
    name: "listWinnerRoles",
    aliases: ["lwr"],
    category: "autorole",
    cmdpermissions: 10,
    description: 'Lists Winner Auto Roles',
    guilds: ["968176372944109709", "968886418883637278"],
    run: async ({ client, message, args }) => {
        let printData = await client.functions.get("autoroles").getAutoRoles(client, message, 2)

        if (printData.length === 0) {
            return await message.reply('No Winner Roles set up on server.')
        }

        let embed = new Discord.EmbedBuilder()
            .setColor(Discord.Colors.Yellow)
            .setTitle("Winner Roles")
            .setDescription(client.functions.get("functions").autoAlign(printData))

        await message.reply({ embeds: [embed] })
    }
}