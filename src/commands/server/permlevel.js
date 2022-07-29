const { getPermissionLevel, getPermissionName } = require("../../handlers/permissions")

module.exports = {
    name: "permlevel",
    category: "server",
    description: "Show your permission level within this server",
    usage: "[User]",
    run: async ({ message, args }) => {
        let target
        if (!args[0])
            message.mentions.members.first() || await message.guild.members.fetch(args[0])
        if (!target) {
            target = message.member
        }
        await message.reply(`\`${target.user.username}\` is \`${getPermissionName(getPermissionLevel(target))}\``)
    }
}


