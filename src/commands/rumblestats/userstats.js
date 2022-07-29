const Discord = require("discord.js")

module.exports = {
    name: "userstats",
    category: "rumblestats",
    usage: "[user]",
    guilds: ["968176372944109709", "968886418883637278"],
    description: 'Shows the user rumble stats',
    run: async ({ client, message, args }) => {
        let member = message.mentions.users.first()
        if (!member)
            member = message.member
        else
            member = message.guild.members.cache.get(member.id)

        let user = await client.functions.get("functions").getUser(message.guild.id, member.id)

        let embed = new Discord.MessageEmbed()
            .setColor("PURPLE")
            .setTitle(`${member.displayName} Rumble Stats`)
            .addFields([
                {
                    name: "Wins:",
                    value: user.winCount + " games"
                },
                {
                    name: "Hosted:",
                    value: user.hostCount + " games"
                }
            ])

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        message.reply({ embeds: [embed] })
    }
}