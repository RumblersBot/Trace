const { resolveMember, resolveRole } = require('../../functions/parameters');
module.exports = {
    name: "togglerole",
    aliases: ["tr"],
    category: "hidden",
    cmdpermissions: 0,
    description: 'Toggle a role for a user',
    usage: "<role>|[user]",
    run: async ({ client, message, args }) => {
        let param = args.join(" ").split("|")

        let targetMember = await resolveMember(message, param[1], true)
        let targetRole = await resolveRole(message, param[0])

        if (!targetRole) return await message.reply("Role not found")

        if (!targetMember.roles.cache.has(targetRole.id)) {
            targetMember.roles.add(targetRole.id)
            return await message.reply(`Added role \`${targetRole.name}\` to \`${targetMember.displayName}\``)
        } else {
            targetMember.roles.remove(targetRole.id)
            return await message.reply(`Removed role \`${targetRole.name}\` from \`${targetMember.displayName}\``)
        }
    }
}