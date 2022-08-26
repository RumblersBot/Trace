module.exports = {
    name: "addWinnerRole",
    aliases: ["awr"],
    category: "autorole",
    cmdpermissions: 10,
    description: 'Add a Winner Auto Role',
    usage: "<fromCount> <roleID>",
    guilds: ["968176372944109709", "968886418883637278"],
    run: async ({ client, message, args }) => {
        let fromCount = args[0]
        if (!fromCount)
            return await message.reply("No From Count supplied")
        if (isNaN(fromCount))
            return await message.reply("From count is not a number")

        let roleID = args[1]

        if (!roleID)
            return await message.reply("Role ID not supplied")

        const role = await message.guild.roles.fetch(roleID)
        if (!role)
            return await message.reply("Role not found")


        await client.functions.get("autoroles").addAutoRole(client, message, 2, fromCount, role)

        await message.reply(`The Winner role \`${role.name}\` with a minimum count of \`${fromCount.toLocaleString()}\` has been registered.`)
    }
}