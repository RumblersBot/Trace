const { getPermissionLevel, getPermissionName } = require("../../handlers/permissions")

module.exports = {
    name: "permlevel",
    category: "server",
    description: "Show your permission level within this server",
    usage: "[User]",
    run: async ({ message, args }) => {
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!target) {
            target = message.member
        }
        await message.reply(`\`${target.user.username}\` is \`${getPermissionName(getPermissionLevel(target))}\``)
    }
}


