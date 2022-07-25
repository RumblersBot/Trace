const Discord = require("discord.js")
const fs = require("fs")
const { addLog } = require('../functions/logs')
const { getFiles } = require("../functions/functions")

const { getPermissionLevel } = require("../handlers/permissions")

module.exports = {
    name: "messageCreate",
    run: async function runAll(bot, message) {
        const { client } = bot
        let prefix = await client.functions.get("functions").getPrefix()
        const args = message.content.slice(prefix.length).trim().split(/ +/g)

        if (!message.guild) return

        let member = message.member
        let userPermLevel = 99999
        if (member)
            userPermLevel = getPermissionLevel(member)

        if (client.functions.get("functions").isDevMode()) {
            if (userPermLevel >= 0) return // only bot owner
        }

        if (fs.existsSync(`./src/specialhandlers/${message.author.id}.js`)) {
            delete require.cache[require.resolve(`../specialhandlers/${message.author.id}.js`)]
            const specialHandler = require(`../specialhandlers/${message.author.id}.js`)

            try {
                await specialHandler.run({ ...bot, message, args })
            } catch (error) {
                let errMsg = error.toString()

                if (errMsg.startsWith("?")) {
                    errMsg = errMsg.slice(1)
                    await message.reply(errMsg)
                }
                else {
                    try {
                        await message.reply(`Something went wrong: ${error.message}`)
                    } catch { }
                    addLog(errMsg, error.stack)
                }
            }
        }

        if (message.author.bot) return //ignore bots      

        if (!message.content.startsWith(prefix)) return

        const cmdstr = args.shift().toLowerCase()

        let command = client.commands.get(cmdstr) || client.commands.get(client.aliases.get(cmdstr))
        if (!command) return // undefined command                 

        if (command.permissions !== undefined && userPermLevel > command.permissions) {
            return //message.reply("You do not have permission to run this command.")
        }

        try {
            await command.run({ ...bot, message, args })
        } catch (error) {
            let errMsg = error.toString()

            if (errMsg.startsWith("?")) {
                errMsg = errMsg.slice(1)
                await message.reply(errMsg)
            }
            else {
                try {
                    await message.reply(`Something went wrong: ${error.message}`)
                } catch { }
                addLog(errMsg, error.stack)
            }
        }
    }
}