const { addMember, removeMember } = require('../functions/pinglist')

module.exports = {
    name: "ping",
    run: async (client, interaction, parameters) => {
        const action = parameters[0]

        if (!interaction.guild)
            return await interaction.reply({ content: "This command can only be used in a guild", ephemeral: true })

        const member = await interaction.guild.members.fetch(interaction.member.id)

        switch (action) {
            case 'unsub':
                removeMember(member)
                return await interaction.reply({ content: "You have unsubscribed from the ping list role", ephemeral: true })
            default:
                addMember(member, 30 * 60)

                let prefix = await client.functions.get("functions").getPrefix(interaction.guild.id)
                let footer = "\n\nFor an other subscription time, use \`" + prefix + "sub <duration>\` (eg. \`" + prefix + "sub 1h\`)."
                footer += "\nUnsubscribe through the button or use \`" + prefix + "unsub\`"

                return await interaction.reply({ content: "You have subscribed for the next 30 minutes" + footer, ephemeral: true })
        }

    }
}