const Discord = require("discord.js")

module.exports = {
    name: "createembed",
    category: "hidden",
    description: 'Create an embed',
    permissions: 0,
    usage: "<color>|<title>|<message>",
    run: async ({ client, message, args }) => {
        let param = args.join(" ").split("|")
        let embed = new Discord.MessageEmbed()
            .setColor(param[0])
            .setTitle(param[1])
            .setDescription(param[2])

        //embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await message.delete()
        message.channel.send({
            embeds: [embed]
        })

    }
}