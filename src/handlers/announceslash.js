module.exports = async (bot) => {
    const { client } = bot

    console.log(`Announcing ${client.slashcommands.size} slash commands`)
    if (client.slashcommands.size == 0) return
    client.guilds.cache.forEach(guild => {
        console.log(`*** Announcing in [${guild.id}]: [${guild.name}]`)
        const toAnnounce = client.slashcommands.filter(sc => !sc.guilds || sc.guilds.includes(guild.id))
        guild.commands.set([...toAnnounce.values()])
    });
    console.log("Finished announcing slash command")
}