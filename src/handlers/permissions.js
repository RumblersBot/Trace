const {permissionLevels} = require("../data/permission_config")
/**
 *
 * @param member GuildMember Object
 * @returns permission level
 */
const getPermissionLevel = (member) => {

    try {
        for (let permlvl of permissionLevels) {
            // check if there is matching userID
            if (permlvl.user_ids.includes(member.id))
                return permlvl.level
    
            // check all guild permissions
            let hasPerms = false
            for (let perm of permlvl.guild_perms){
                hasPerms = member.permissions.has(perm)
                if (!hasPerms) break
            }
            if (hasPerms)
                return permlvl.level
    
            // check if there is matching roles
            for (let role of member._roles){
                if (permlvl.role_ids.includes(role))
                    return permlvl.level
            }    
        }        
    } catch (error) {
        return 99
    }
}
/**
 *
 * @param level
 * @returns permission name
 */
const getPermissionName = (level) => {
    const permission = permissionLevels.find(permlvl => permlvl.level === level)
    if (!permission)
        return "invalid/unknown permission level"
    return permission.name
}

module.exports = {
    getPermissionLevel,
    getPermissionName
}