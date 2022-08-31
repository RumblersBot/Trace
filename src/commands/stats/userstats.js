const Discord = require("discord.js")
const User = require("../../_database/models/userSchema")
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

        let winPos = await User.find({ guildID: message.guild.id, winCount: { $gt: user.winCount } }).count().exec()
        let hostPos = await User.find({ guildID: message.guild.id, hostCount: { $gt: user.hostCount } }).count().exec()

        let userSub = await getMember(member)
        let subValue
        if (!!userSub)
            subValue = `Expires <t:${userSub.entryTimeStamp}:R>`
        else
            subValue = 'No active subscription'

        let embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `${member.displayName}'s Stats`, iconURL: member.displayAvatarURL({ format: 'png', size: 512 }) })
            .setColor(Discord.Colors.Purple)
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
                },
                {
                    name: "Ping Subscription:",
                    value: subValue,
                    inline: false
                },
                {
                    name: "Win Rank:",
                    value: `\`${winPos + 1}\``,
                    inline: true
                },
                {
                    name: "Hosted Rank:",
                    value: `\`${hostPos + 1}\``,
                    inline: true
                }
            ])

        //embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await message.reply({ embeds: [embed] })
        await client.functions.get("autoroles").checkAutoRoles(client, message, user, member)
    }
}