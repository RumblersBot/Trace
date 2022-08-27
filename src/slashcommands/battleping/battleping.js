const { Permissions } = require("discord.js")
const Discord = require("discord.js")
const { getBattlePing } = require('../../functions/battleping')

module.exports = {
    name: "battleping",
    description: "Runs a Battle Ping",
    category: "battleping",
    guilds: ["968176372944109709", "968886418883637278","841882715585904650"],
    cmdpermissions: 20,
    //default_member_permissions: Permissions.FLAGS.MANAGE_CHANNELS,
    options: [
        {
            name: "era",
            description: "Rumble Era.",
            type: "STRING",
            choices: [
                {
                    name: "classic",
                    value: "<:Classic:975042325610913812> Classic"
                },
                {
                    name: "steampunk",
                    value: "<:Steampunk:994691835027001364> Steampunk"
                },
                {
                    name: "modern",
                    value: "<:Modern:975043124856492132> Modern"
                },
                {
                    name: "futuristic",
                    value: "<:Futuristic:975063325715083264> Futuristic"
                },
                {
                    name: "medieval",
                    value: "<:Medieval:975069348798558318> Medieval"
                },
                {
                    name: "samurai",
                    value: "<:Samurai:976607652052340757> Samurai"
                },
                {
                    name: "zombie",
                    value: "<:Zombie:1000690492679397406> Zombie"
                },
                {
                    name: "pirate",
                    value: "<:Pirate:975370834770272256> Pirate"
                }
            ],
            required: true
        },
        {
            name: "message",
            description: "Custom message.",
            type: "STRING",
            required: false
        },
    ],
    run: async ({ client, interaction }) => {

        await interaction.deferReply({ ephemeral: true })

        const bp = await getBattlePing(interaction.channel)
        if (!bp) return interaction.editReply({ content: "No battleping set up for this channel" })

        let era = interaction.options.getString("era")
        let message = interaction.options.getString("message")

        let title = `<a:fight:1012725282366562406> __**A new ${bp.title || ""} Battle has begun!**__`
        let description = "React with <:Swords:976587202387673200> to the message above to compete in this battle!"
        if (bp.countDown > 0) {
            let start = Math.round(Date.now() / 1000 + (bp.countDown * 60))
            description += `\nThis battle will start roughly <t:${start}:R>`
        }

        description += '\n\n'
        description += `__\`Era:\`__ ${era}\n`
        description += `__\`Reward:\`__ ${bp.reward}\n`
        description += `__\`Message from Host:\`__ `
        if (!!message) description += message
        else description += bp.defaultMessage
        if (!!bp.footerMessage) description += `\n\n${bp.footerMessage}`

        let embed = new Discord.MessageEmbed()
            .setThumbnail("https://cdn.discordapp.com/avatars/693167035068317736/07a5a2e976c581ffb9074f8180070880.png?size=1024")
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTitle(title)
            .setDescription(description)
            .setColor("BLUE")

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await interaction.channel.send({ content: `<@&${bp.pingRole}> started by ${interaction.member}`, embeds: [embed] })
        await interaction.editReply({ content: "Battle ping sent." })
    }
}
