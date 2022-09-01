const Log = require('../_database/models/logSchema')
const mongoose = require('mongoose')

async function addLog(channel, content, stacktrace) {
    let ctnt = content
    if (!!channel) {
        ctnt = `${channel.guild.name}(\`${channel.guild.id}\`) - #${channel.name}(\`${channel.id}\`): ${ctnt}`
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

async function clearLogs() {
    await Log.deleteMany({})
}

module.exports = {
    name: "logs",
    addLog,
    getLogs,
    clearLogs
}