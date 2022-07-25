// user_ids     match any
// role_ids     match any
// guild_perms  match all


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
            guild_perms:["ADMINISTRATOR"]
        },
        {
            name: "Moderator",
            level: 10,
            user_ids:[],
            role_ids:[],
            guild_perms:["MANAGE_CHANNELS"]
        },        
        {
            name: "Helper",
            level: 20,
            user_ids:[],
            role_ids:['995786988470931508'],
            guild_perms:["MANAGE_MESSAGES"]
        },
        {
            name: "Member",
            level: 99,
            user_ids: [],
            role_ids: [],
            guild_perms: ["SEND_MESSAGES"]
        }
    ]
}