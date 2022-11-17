const Discord = require("discord.js")

module.exports = {
    name: "announcement",
    description: "Manage announcements",
    category: "announcement",
    cmdpermissions: 10,
    guilds: ["968886418883637278", "968176372944109709"],
    options: [
        {
            name: "add",
            description: "Adds announcement",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: 'Channel to post the announcement',
                    type: Discord.ApplicationCommandOptionType.Channel,
                    required: true
                },
                {
                    name: "message",
                    description: 'Message to announce',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "dayofweek",
                    description: 'Day of the week to run the announcement',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: true,
                    choices: [
                        {
                            name: "Monday",
                            value: 1
                        },
                        {
                            name: "Tuesday",
                            value: 2
                        },
                        {
                            name: "Wednesday",
                            value: 3
                        },
                        {
                            name: "Thursday",
                            value: 4
                        },
                        {
                            name: "Friday",
                            value: 5
                        },
                        {
                            name: "Saturday",
                            value: 6
                        },
                        {
                            name: "Sunday",
                            value: 7
                        }
                    ]
                },
                {
                    name: "hour",
                    description: 'Which hour to run the annoucement (GMT)',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: true
                },
                {
                    name: "minutes",
                    description: 'Minutes to run the announcement on (default 0)',
                    type: Discord.ApplicationCommandOptionType.Integer
                },

            ]
        },
        {
            name: "remove",
            description: "Remove announcement",
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "id",
                    description: 'announcement id to remove',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "list",
            description: "List all defined announcements",
            type: Discord.ApplicationCommandOptionType.Subcommand
        }
    ],
    run: async (bot) => {
        var { interaction } = bot
        const { addAnnouncement, removeAnnouncement, listAnnouncements } = require("../../functions/announcements")
        switch (interaction.options.getSubcommand()) {
            case 'add':
                await addAnnouncement(bot)
                break;
            case 'remove':
                await removeAnnouncement(bot)
                break;
            case 'list':
                await listAnnouncements(bot)
                break;
        }
    }
}