const Discord = require("discord.js")
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js")
const { getBattlePing } = require('../../functions/battleping')

module.exports = {
    name: "battleping",
    description: "Runs a Battle Ping",
    category: "battleping",
    guilds: ["968176372944109709", "968886418883637278", "841882715585904650"],
    cmdpermissions: 20,
    //default_member_permissions: PermissionFlagsBits.ManageChannels,
    options: [
        {
            name: "era",
            description: "Rumble Era.",
            type: ApplicationCommandOptionType.String,            
            required: true
        },
        {
            name: "message",
            description: "Custom message.",
            type: ApplicationCommandOptionType.String,
            required: false
        },
    ],
    showPing: async (client, interaction, era, message, testchannel) => {

        let targetChannel = interaction.channel
        if (!!testchannel) targetChannel = testchannel

        await interaction.deferReply({ ephemeral: true })

        const bp = await getBattlePing(targetChannel)
        if (!bp) return interaction.editReply({ content: "No battleping set up for this channel" })

        let title = `<a:fight:1012725282366562406> __**A new ${bp.title || ""} Battle has begun!**__`
        let description = "React with <:Swords:1021412800431669350> to the message above to compete in this battle!"
        if (bp.countDown > 0) {
            let start = Math.round(Date.now() / 1000 + (bp.countDown * 60))
            description += `\nThis battle will start roughly <t:${start}:R>`
        }

        description += '\n\n'
        description += `__\`Era:\`__ ${era}\n`
        if (!!bp.reward)
            description += `__\`Reward:\`__ ${bp.reward}\n`
        
        let guildSettings = await client.functions.get("functions").getGuildSettings(interaction.guild.id)
        if (!!guildSettings.ownerMessage)
            description += `__\`Owner Message:\`__ ${guildSettings.ownerMessage}\n`

        description += `__\`Message from Host:\`__ `
        if (!!message) description += message
        else description += bp.defaultMessage

        if (!!bp.footerMessage) description += `\n\n${bp.footerMessage}`

        let embed = new Discord.EmbedBuilder()
            .setThumbnail("https://cdn.discordapp.com/avatars/693167035068317736/07a5a2e976c581ffb9074f8180070880.png?size=1024")
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTitle(title)
            .setDescription(description)
            .setColor(Discord.Colors.Blue)

        //if (!!bp.footerMessage) embed.setFooter({ text: bp.footerMessage })

        let contentMsg = `<@&${bp.pingRole}> started by ${interaction.member}`

        if (!!testchannel) {
            contentMsg = `Channel test for: \`${targetChannel.name}\`\n` + contentMsg
            await interaction.channel.send({ content: contentMsg, embeds: [embed], allowedMentions: { parse: [] } })
        } else {
            await interaction.channel.send({ content: contentMsg, embeds: [embed] })
        }

        await interaction.editReply({ content: "Battle ping sent." })
    },
    run: async ({ client, interaction }) => {
        module.exports.showPing(client, interaction, interaction.options.getString("era"), interaction.options.getString("message"), null)
    }
}
