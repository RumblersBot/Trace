module.exports = {
    name: "setplaying",
    category: "hidden",
    permissions: -1,
    description: 'Set the bot "IsPlaying" status',
    usage: "[Status]",
    run: async ({ client, message, args }) => {
        const status = args.join(" ")
        if (!status) {
            client.user.setPresence({ activity: null })
        } else {
            client.user.setPresence({ activities: [{ name: status }] });
        }
        await message.reply({ content: "Bot status updated", ephemeral: true })
    }
}