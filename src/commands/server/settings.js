const Discord = require("discord.js")
module.exports = {
    name: "settings",
    aliases: [],
    category: "server",
    cmdpermissions: 0,
    description: 'Guild bot server settings',
    usage: "[property <value>]",
    run: async ({ client, message, args }) => {
        let guildSettings = await client.functions.get("functions").getGuildSettings(message.guild.id)

        let properties = ["prefix"]

        if (["968176372944109709", "968886418883637278"].includes(message.guild.id)) properties.push("shopresetchannel")
        if (["968176372944109709", "968886418883637278", "841882715585904650"].includes(message.guild.id)) properties.push("ownermessage")

        if (!args.length) {
            let embed = new Discord.EmbedBuilder()
                .setTitle(`Trace Server Settings: ${message.guild.name}`)
                .setColor(Discord.Colors.Red)
                .setDescription(`If nothing is shown, there are no properties assigned\nProperties: ${properties.join(", ")}`)

            if (guildSettings.prefix) embed.addFields({ name: "Prefix", value: guildSettings.prefix })
            if (["968176372944109709", "968886418883637278"].includes(message.guild.id))
                if (!!guildSettings.shopResetChannelID)
                    embed.addFields({ name: "Shop Reset Channel", value: `<#${guildSettings.shopResetChannelID}>` })

            if (["968176372944109709", "968886418883637278", "841882715585904650"].includes(message.guild.id))
                if (!!guildSettings.ownerMessage)
                    embed.addFields({ name: "Owner Message", value: guildSettings.ownerMessage })

            embed = client.functions.get("functions").setEmbedFooter(embed, client)

            message.channel.send({ embeds: [embed] })
        } else {
            if (!properties.includes(args[0])) return message.reply(`No valid property supplied.\nAllowed Properties: ${properties}`)
            if (!args[1]) return message.reply("No value supplied.")

            if ("prefix" === args[0]) {
                guildSettings.prefix = args[1]
                await guildSettings.save()
                message.reply(`Settings updated: \`${args[0]}\` to ${args[1]}`)
            }
            if ("shopresetchannel" === args[0]) {
                guildSettings.shopResetChannelID = args[1]
                await guildSettings.save()
                message.reply(`Settings updated: \`${args[0]}\` to ${args[1]}`)
            }
            if ("ownermessage" === args[0]) {
                let msg = args.slice(1).join(" ")
                if (msg === "''")
                    guildSettings.ownerMessage = ""
                else
                    guildSettings.ownerMessage = msg
                await guildSettings.save()
                message.reply(`Settings updated: \`${args[0]}\` to ${args[1]}`)
            }
        }
    }
}