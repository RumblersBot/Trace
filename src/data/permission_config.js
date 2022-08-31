// user_ids     match any
// role_ids     match any
// guild_perms  match all

const { PermissionFlagsBits } = require("discord.js");


module.exports = {
    permissionLevels: [
        {
            name: "Bot Owner",
            level: -1,
            user_ids:[
                "403654158609154058" // MagnoBE#0826
            ],
            role_ids:[],
            guild_perms:[]
        },
        {
            name: "Administrator",
            level: 0,
            user_ids:[],
                role_ids:[],
            guild_perms:[PermissionFlagsBits.Administrator]
        },
        {
            name: "Moderator",
            level: 10,
            user_ids:[],
            role_ids:[],
            guild_perms:[PermissionFlagsBits.ManageChannels]
        },        
        {
            name: "Helper",
            level: 20,
            user_ids:["989126431114149909"],
            role_ids:[
                "995786988470931508" // The Rumblers Helpers
            ],
            guild_perms:[PermissionFlagsBits.ManageMessages]
        },
        {
            name: "Rumblers Server Booster",
            level: 30,
            user_ids: [],
            role_ids:[
                "977260788110749757" // The Rumblers Server Booster
            ],
            guild_perms:[]
        },
        {
            name: "Member",
            level: 99,
            user_ids: [],
            role_ids: [],
            guild_perms: [PermissionFlagsBits.SendMessages]
        }
    ]
}