const Discord = require("discord.js")
const { viewSettings } = require("../../functions/usersettings")

module.exports = {
    name: "usersettings",
    description: "User Settings",
    category: "usersettings",
    global: true,
    options: [
        {
            name: "view",
            description: "View User Settings",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "member",
                    description: "Member to view settings of",
                    type: Discord.ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        },
        {
            name: "set",
            description: "Set user Settings",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "hostreminder",
                    description: 'enable or disable host reminder',
                    type: Discord.ApplicationCommandOptionType.Boolean,
                    required: false
                }
            ]
        }
    ],
    run: async (bot) => {
        var { interaction } = bot
        const { viewSettings, editSettings } = require("../../functions/usersettings")
        switch (interaction.options.getSubcommand()) {
            case 'view':
                await viewSettings(bot)
                break;
            case 'set':
                await editSettings(bot)
                break;
        }
    }
}