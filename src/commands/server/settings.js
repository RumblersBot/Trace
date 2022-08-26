const Discord = require("discord.js")
module.exports = {
    name: "settings",
    aliases: [],
    category: "server",
    cmdpermissions: 0,
    description: 'Guild bot server settings',
    usage: "[prefix <value>]",
    run: async ({ client, message, args }) => {
        let guildSettings = await client.functions.get("functions").getGuildSettings(message.guild.id)

        const properties = ["prefix"]

        if (!args.length) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`Trace Server Settings: ${message.guild.name}`)
                .setColor('RED')
                .setDescription(`If nothing is shown, there are no properties assigned\nProperties: ${properties.join(", ")}`)

            if (guildSettings.prefix) embed.addFields({name: "Prefix", value: guildSettings.prefix})


            embed = client.functions.get("functions").setEmbedFooter(embed, client)

            message.channel.send({ embeds: [embed] })
        } else {
            if (!properties.includes(args[0])) return message.reply(`No valid property supplied.\nAllowed Properties: ${properties}`)
            if (!args[1]) return message.reply("No value supplied.")

            if ("prefix" === args[0]) {
                guildSettings.prefix = args[1]
                await guildSettings.save()
                message.reply(`Settings updated: ${args[0]} to ${args[1]}`)
            }
        }
    }
}