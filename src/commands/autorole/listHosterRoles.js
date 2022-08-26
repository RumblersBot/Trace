const Discord = require("discord.js")
module.exports = {
    name: "listHosterRoles",
    aliases: ["lhr"],
    category: "autorole",
    cmdpermissions: 10,
    description: 'Lists Hoster Auto Roles',
    guilds: ["968176372944109709", "968886418883637278"],
    run: async ({ client, message, args }) => {
        let printData = await client.functions.get("autoroles").getAutoRoles(client, message, 1)

        if (printData.length === 0) {
            return await message.reply('No Hoster Roles set up on server.')
        }

        let embed = new Discord.MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Hoster Roles")
            .setDescription(client.functions.get("functions").autoAlign(printData))

        await message.reply({ embeds: [embed] })
    }
}