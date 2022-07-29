const Discord = require("discord.js")

module.exports = {
    name: "userstats",
    category: "rumblestats",
    usage: "[user]",
    guilds: ["968176372944109709", "968886418883637278"],
    description: 'Shows the user rumble stats',
    run: async ({ client, message, args }) => {
        let member
        if (!!args[0])
            member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        if (!member)
            member = message.member

        let user = await client.functions.get("functions").getUser(message.guild.id, member.id)

        let embed = new Discord.MessageEmbed()
            .setColor("PURPLE")
            .setTitle(`${member.displayName}'s Rumble Stats`)
            .addFields([
                {
                    name: "Wins:",
                    value: user.winCount + " games",
                    inline: true
                },
                {
                    name: "Hosted:",
                    value: user.hostCount + " games",
                    inline: true                    
                }
            ])

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        message.reply({ embeds: [embed] })
    }
}