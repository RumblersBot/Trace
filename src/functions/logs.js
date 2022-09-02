const Log = require('../_database/models/logSchema')
const mongoose = require('mongoose')
const fs = require("fs")

async function addLog(channel, content, stacktrace) {
    let ctnt = content
    if (!!channel) {
        ctnt = `${channel.guild.name}(\`${channel.guild.id}\`) - #${channel.name}(\`${channel.id}\`):\n${ctnt}`
    }
    console.log(ctnt)
    let log = await new Log({
        _id: mongoose.Types.ObjectId(),
        content: ctnt,
        stacktrace: stacktrace
    })
    await log.save().catch(error => console.log(error))
}

async function getLogs(number) {
    let log = await Log.find({}).sort('-createdAt').limit(number).exec()
    let logs = ""
    log.forEach(l => {
        let topfile
        try {
            topfile = l.stacktrace.split('\n')[1].trim().split('src')
            topfile = topfile[1].split(')')[0]
        } catch (error) {

        }
        logs += `\`${l.createdAt.toJSON()}\`\t${l.content} *(${topfile})*\n`
    })    
    return logs    
}

function addUsage(guild, author, description) {
    try {
        let logData = `${(new Date).toJSON()}\t`
        logData += `${guild.name}\t`               
        logData += "".padEnd(24-(guild.name.length), " ")
        logData += `${author.tag}\t`
        logData += "".padEnd(24-(author.tag.length), " ")
        logData += `${description}\n`
        fs.appendFile("./usage.log", logData, (err) => { if (err) console.log(`error occurred: ${err}`) })
    } catch (error) {
        console.log("usage logging failed.")
    }
}

async function clearLogs() {
    await Log.deleteMany({})
}

module.exports = {
    name: "logs",
    addLog,
    getLogs,
    clearLogs,
    addUsage
}