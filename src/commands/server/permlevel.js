const { getPermissionLevel, getPermissionName } = require("../../handlers/permissions")
const { resolveMember } = require('../../functions/parameters');

module.exports = {
    name: "permlevel",
    category: "server",
    description: "Show your permission level within this server",
    usage: "[User]",
    run: async ({ message, args }) => {
        let target = await resolveMember(message, args[0], true)

        await message.reply(`\`${target.user.username}\` is \`${getPermissionName(getPermissionLevel(target))}\``)
    }
}


