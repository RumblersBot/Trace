const EventBattleWinner = require('../../_database/models/eventBattleWinnerSchema')
const { resolveMember } = require('../../functions/parameters');

module.exports = {
    name: "eventbattlewinner",
    aliases: ["ebw"],
    category: "eventbattlewinner",
    cmdpermissions: 20,
    description: 'Adds the channel Event Battle Winner roles to the user',
    usage: "<User>",
    run: async ({ client, message, args }) => {
        if (!args[0]) {
            return await message.reply("No user supplied.")
        }        

        let target = await resolveMember(message, args[0], false)       
        if (!target) {
            return await message.reply("No valid user supplied.")
        }        

        let bw = await EventBattleWinner.find({
            guildID: message.guild.id,
            channelID: message.channel.id
        })

        if (bw.length === 0) {
            return //await message.reply("No Battle Winner Roles set for \`${channel.name}\`.")
        }

        message.delete()

        bw.forEach( async r => {
            const role = await message.guild.roles.fetch(r.roleID)
            if (!target.roles.cache.has(r.roleID)) {
                await target.roles.add(r.roleID)
                await message.channel.send(`Added \`${role.name}\` to \`${target.displayName}\``)
            } else {
                await message.channel.send(`\`${target.displayName}\` already has the role \`${role.name}\``)
            }
        })
    }
}