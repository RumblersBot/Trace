const Discord = require("discord.js")

module.exports = {
    name: "updateembed",
    category: "hidden",
    description: 'Update an embed',
    cmdpermissions: 0,
    usage: "<channel>|<messageID>|<color>|<title>|<message>",
    run: async ({ client, message, args }) => {
        let param = args.join(" ").split("|")
        const color = param[2].replace(/\w+/g,
            function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); });
        let embed = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(param[3])
            .setDescription(param[4])

        //embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await message.delete()
        client.channels.cache.get(param[0]).messages.fetch(param[1]).then((msg) => {
            msg.edit({
                embeds: [embed]
            })
        })
    }
}