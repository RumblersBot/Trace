const { getMember } = require('../../functions/pinglist')
module.exports = {
    name: "showchannelpinglistsubscription",
    aliases: ["showsub"],
    category: "pinglist",
    description: 'Show your current subscription',
    run: async ({ client, message, args }) => {
        let member = await getMember(message.member)

        if (!member)
            return await message.reply("You have no current subscription.")

        await message.reply(`Your subscription is active. It will expire <t:${member.entryTimeStamp}:R>.`)
    }
}