const { removeMember } = require('../../functions/pinglist')
module.exports = {
    name: "unsubscribechannelpinglist",
    aliases: ["unsub"],
    category: "pinglist",
    description: 'Unsubscribe to the channel ping list',
    run: async ({ client, message, args }) => {
        removeMember(message.member)

        await message.reply("Any pending subscriptions have been removed.")
    }
}