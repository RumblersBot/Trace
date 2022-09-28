const { PermissionFlagsBits } = require("discord.js")
module.exports = {
    name: "ping",
    description: "Ping",
    category: "info",
    global: true,
    run: async ({ client, interaction }) => {
        const msg = await interaction.reply({fetchReply: true, content: `:ping_pong: Main bot Pinging...`});
        msg.edit(`:ping_pong: Pong! \n` + 
                 `API: \`${Math.round(client.ws.ping)}\`ms\n` + 
                 `Bot: \`${msg.createdAt - interaction.createdAt}\`ms.\n` + 
                 `Uptime: ${client.functions.get("functions").formatTime(client.uptime)}`);
    }
}
