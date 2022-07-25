module.exports = {
    name: "ping",
    category: "info",
    description: 'Simple ping with timings',
    run: async ({ client, message }) => {
        const msg = await message.reply({fetchReply: true, content: `:ping_pong: Main bot Pinging...`});
        msg.edit(`:ping_pong: Pong! \n` + 
                 `API: \`${Math.round(client.ws.ping)}\`ms\n` + 
                 `Bot: \`${msg.createdAt - message.createdAt}\`ms.\n` + 
                 `Uptime: ${client.functions.get("functions").formatTime(client.uptime)}`);
    }
}