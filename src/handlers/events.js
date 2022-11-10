const { getFiles } = require("../functions/functions")
const { addLog } = require('../functions/logs')

module.exports = (bot, reload) => {
    const { client } = bot

    let events = getFiles("./src/events", ".js")

    if (events.length === 0) {
        console.log("No events")
    }

    events.forEach((f, i) => {
        if (reload)
            delete require.cache[require.resolve(`../events/${f}`)]
        const event = require(`../events/${f}`)
        client.events.set(event.name, event)

        if (!reload)
            console.log(`${i + 1}. ${f} loaded`)
    })

    if (!reload)
        initEvents(bot)
}

function triggerEventHandler(bot, event, ...args) {
    const { client } = bot

    try {
        if (client.events.has(event))
            client.events.get(event).run(bot, ...args)
        else
            throw new Error(`Event ${event} does not exist`)
    } catch (error) {
        addLog(null, error, error.stack)
    }
}

function initEvents(bot) {
    const { client } = bot

    client.on("ready", () => {
        triggerEventHandler(bot, "ready")
    })

    client.on("messageCreate", (message) => {
        triggerEventHandler(bot, "messageCreate", message)
    })

    //joined a server
    client.on("guildCreate", guild => {
        client.guilds.cache.get("968886418883637278").channels.cache.get("1040288842894295080").send(`Joined a new guild: ${guild.name} (${guild.id})`)
    })

    //removed from a server
    client.on("guildDelete", guild => {
        if (guild.available)
            client.guilds.cache.get("968886418883637278").channels.cache.get("1040288842894295080").send(`Left a guild: ${guild.name} (${guild.id})`)
    })

    client.on("interactionCreate", (interaction) => {
        triggerEventHandler(bot, "interactionCreate", interaction)
    })
}