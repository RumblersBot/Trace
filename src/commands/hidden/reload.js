const Discord = require("discord.js")
const fs = require("fs")

module.exports = {
    name: "reload",
    category: "hidden",
    cmdpermissions: 0,
    description: "reloads the bot",
    usage: "[force]",
    run: async (bot) => {

        const {args} = bot
        const force = args.join(" ") === "1"

        //Object.keys(require.cache).forEach(function(key) { delete require.cache[key] })

        var { client, message } = bot;
        await client.loadCommands(bot, true);
        await client.loadEvents(bot, true);
        await client.loadButtons(bot, true)
        await client.loadSlashCommands(bot, true)
        await client.loadFunctions(bot, true);
        client.categories = fs.readdirSync("./src/commands/");
        client.slashcategories = fs.readdirSync("./src/slashcommands/");

        await client.announceSlashCommands(bot, force)

        const os = require("os")

        let embed = new Discord.EmbedBuilder()
            .setColor("#8DC685")
            .setTitle(`Bot Reload Complete on \`${os.hostname()}\``)
            .setDescription(client.functions.get("functions").autoAlign([
                [`\`${client.commands.size}\``, `Commands`],
                [`\`${client.aliases.size}\``, `Aliases`],
                [`\`${client.events.size}\``, `Events`],
                [`\`${client.buttons.size}\``, `Buttons`],
                [`\`${client.slashcommands.size}\``, `SlashCommands`],
                [`\`${client.functions.size}\``, `Functions`],
                [`\`${force}\``, `Forced`],
            ]))

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await message.reply({ embeds: [embed] })
    }
}