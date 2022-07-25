module.exports = {
    name: "clearlogs",
    category: "logs",
    permissions: -1,
    description: 'Clear the botlogs',
    run: async ({ client, message }) => {

        await client.functions.get("logs").clearLogs()

        await message.reply('Logs cleared')
    }
}