const Discord = require("discord.js")
const { getMember } = require('../../functions/pinglist')
const { resolveMember } = require('../../functions/parameters');

module.exports = {
    name: "userstats",
    category: "stats",
    usage: "[user]",
    guilds: ["968176372944109709", "968886418883637278"],
    description: 'Shows the user stats',
    run: async ({ client, message, args }) => {
        let member = await resolveMember(message, args[0], true)

        let user = await client.functions.get("functions").getUser(message.guild.id, member.id)

        let embed = new Discord.MessageEmbed()
            .setAuthor({name: `${member.displayName}'s Stats`, iconURL: member.displayAvatarURL({ format: 'png', size: 512 })})
            .setColor("PURPLE")
            .addFields([
                {
                    name: "Rumble Wins:",
                    value: user.winCount + " games",
                    inline: true
                },
                {
                    name: "Rumble Hosted:",
                    value: user.hostCount + " games",
                    inline: true
                }
            ])

        let userSub = await getMember(member)
        if (!!userSub) {
            embed.addFields([{
                name: "Ping Subscription:",
                value: `Expires <t:${userSub.entryTimeStamp}:R>`,
                inline: false
            }])
        }
        //embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await message.reply({ embeds: [embed] })
        await client.functions.get("autoroles").checkAutoRoles(client, message, user, member)
    }
}