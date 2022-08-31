const Discord = require("discord.js")

module.exports = {
    name: "createembed",
    category: "hidden",
    description: 'Create an embed',
    cmdpermissions: 0,
    usage: "<color>|<title>|<message>",
    run: async ({ client, message, args }) => {
        let param = args.join(" ").split("|")
        const color = param[0].replace(/\w+/g,
            function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); });
        let embed = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(param[1])
            .setDescription(param[2])

        //embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await message.delete()
        message.channel.send({
            embeds: [embed]
        })

    }
}