const Discord = require("discord.js")
const User = require("../../_database/models/userSchema")

module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    category: "stats",
    guilds: ["968176372944109709", "968886418883637278"],
    description: 'Shows the server leaderboard',
    run: async ({ client, message, args }) => {
        let topWinners = await User.find({ guildID: message.guild.id }).sort('-winCount').limit(10).exec()
        let topHosters = await User.find({ guildID: message.guild.id }).sort('-hostCount').limit(10).exec()

        const imgArr = [":first_place:", ":second_place:", ":third_place:", "", "", "", "", "", "", ""]

        winString = ""
        for (let index = 1; index <= 10; index++) {
            let winner = topWinners[index - 1]
            if (!!winner) {
                let member = await getMember(message, winner.userID)
                winString += `\`${index.toString().padStart(2, " ")}.\` ${imgArr[index - 1]}**${member.displayName}**\n${winner.winCount.toLocaleString()} wins\n`
            }
        }

        hostString = ""
        for (let index = 1; index <= 10; index++) {
            let hoster = topHosters[index - 1]
            if (!!hoster) {
                let member = await getMember(message, hoster.userID)
                hostString += `\`${index.toString().padStart(2, " ")}.\` ${imgArr[index - 1]}**${member.displayName}**\n${hoster.hostCount.toLocaleString()} hosted\n`
            }
        }

        let embed = new Discord.MessageEmbed()
            .setColor("GOLD")
            .setTitle(`Rumble Stats Leaderboard`)
            .addFields([
                {
                    name: "Wins:",
                    value: winString,
                    inline: true
                },
                {
                    name: "Hosted:",
                    value: hostString,
                    inline: true
                }
            ])

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        message.reply({ embeds: [embed] })
    }
}


async function getMember(message, memberID) {
    let member = await message.guild.members.cache.get(memberID)
    if (!member)
        member = await message.guild.members.fetch(memberID)

    return member
}