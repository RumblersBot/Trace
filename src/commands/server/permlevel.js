const { getPermissionLevel, getPermissionName } = require("../../handlers/permissions")

module.exports = {
    name: "permlevel",
    category: "server",
    description: "Show your permission level within this server",
    run: async ({ message }) => {
        let target
        if (!target) {
            target = message.member
        }
        await message.reply(`\`${target.user.username}\` is \`${getPermissionName(getPermissionLevel(target))}\``)
    }
}


