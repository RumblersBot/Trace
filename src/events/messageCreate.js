const Discord = require("discord.js")
const fs = require("fs")
const { addLog } = require('../functions/logs')

const { getPermissionLevel } = require("../handlers/permissions")

module.exports = {
    name: "messageCreate",
    run: async function runAll(bot, message) {
        const { client } = bot
        let prefix = await client.functions.get("functions").getPrefix(message.guild.id)
        const args = message.content.slice(prefix.length).trim().split(/ +/g)

        if (!message.guild) return

        let mentionedBot = (message.content.trim().startsWith(`<@${client.user.id}>`))

        let member = message.member
        let userPermLevel = getPermissionLevel(member)

        if (client.functions.get("functions").isDevMode()) {
            if (message.guild.id !== '968886418883637278') // exclude test server
                if (userPermLevel >= 0) return // only bot owner
        }

        if (fs.existsSync(`./src/specialhandlers/${message.author.id}.js`)) {
            try {
                delete require.cache[require.resolve(`../specialhandlers/${message.author.id}.js`)]
                const specialHandler = require(`../specialhandlers/${message.author.id}.js`)

                await specialHandler.run({ ...bot, message, args })
            } catch (error) {
                handleError(message, error)
            }
        }

        if (message.author.bot) return //ignore bots      

        if (!message.content.startsWith(prefix) && !mentionedBot) return
        if (mentionedBot) {
            args.shift()
            if (args.length === 0)
                try {
                    return message.reply(`Prefix for this server is set to \`${prefix}\``)
                } catch (error) {
                    // probably no permissions to send messages in channel... Don't crash
                    addLog(message.channel, error, error.stack)
                }
        }

        const cmdstr = args.shift().toLowerCase()

        let cmds = client.commands.filter(cmd => !cmd.guilds || cmd.guilds.includes(message.guild.id))

        let command = cmds.get(cmdstr) || cmds.get(client.aliases.get(cmdstr))
        if (!command) return // undefined command                 

        if (command.cmdpermissions !== undefined && userPermLevel > command.cmdpermissions) {
            return //message.reply("You do not have permission to run this command.")
        }

        try {
            try {
                let logData = `${(new Date).toJSON()}\t`
                logData += `${message.guild.name}\t`               
                logData += "".padEnd(6-(message.guild.name.length/4), "\t")
                logData += `${message.author.tag}\t`
                logData += "".padEnd(6-(message.author.tag.length/4), "\t")
                logData += `${command.name} ${args.join(" ")}\n`
                fs.appendFile("./usage.log", logData, (err) => { if (err) console.log(`error occurred: ${err}`) })
            } catch (error) {
                console.log("usage logging failed.")
            }
            command.run({ ...bot, message, args }).catch(async (err) => { handleError(message, err) })
        } catch (error) {
            handleError(message, error)
        }
    }
}

async function handleError(message, error) {
    let errMsg = error.toString()

    if (errMsg.startsWith("?")) {
        errMsg = errMsg.slice(1)
        await message.reply(errMsg)
    }
    else {
        try {
            await message.reply(`Something went wrong: ${error.message}`)
        } catch { }
        addLog(message.channel, errMsg, error.stack)
    }
}