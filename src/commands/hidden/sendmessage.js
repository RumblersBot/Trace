module.exports = {
    name: "sendmessage",
    category: "hidden",
    description: 'Sends a message',
    permissions: 0,
    usage: "<channelID>|<message>",
    run: async ({ client, message, args }) => {
        let param = args.join(" ").split("|")

        await message.delete()

        if (!param[1])
            await message.channel.send({ content: param[1] })
        else
            await client.channels.cache.get(param[0])?.send({ content: param[1] })
    }
}