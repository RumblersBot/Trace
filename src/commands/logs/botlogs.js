module.exports = {
    name: "botlogs",
    category: "logs",
    cmdpermissions: -1,
    description: 'Get the bot logs',
    usage: "[quantity]",
    run: async (bot) => {
        var { client, message, args } = bot;
        let number = args[0]
        if (!number) number = 5

        let logs = await client.functions.get("logs").getLogs(number)
        if (!logs || logs.length == 0) {
            await message.reply('No bot logs present')
        } else {
            await message.reply('Details:\n' + logs)
        }
    }
}