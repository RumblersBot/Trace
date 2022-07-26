const { addMember } = require('../../functions/pinglist')

module.exports = {
    name: "subscribechannelpinglist",
    aliases: ["sub"],
    category: "pinglist",
    description: 'Subscribe to the channel ping list',
    usage: "[duration (eg. 1h, 10m)]",
    run: async ({ client, message, args }) => {
        let duration = args.join(" ")

        if (!duration) duration = "30m"

        let secs = ParseDuration(duration)
        if (!secs) secs = 30 * 60
        if (secs === 0) secs = 30 * 60

        addMember(message.member, secs)
        await message.reply(`You have renewed your subscription. It will expire <t:${Math.round(Date.now() / 1000 + secs)}:R>.`)
    }
}

function ParseDuration(duration) {
    let secs = 0
    let val = 0

    Array.from(duration).forEach(c => {
        switch (c) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                val = val * 10 + parseInt(c)
                break;

            case 'd':
            case 'D':
                secs += val * 24 * 60 * 60
                val = 0
                break;

            case 'h':
            case 'H':
                secs += val * 60 * 60
                val = 0
                break;

            case 'm':
            case 'M':
                secs += val * 60
                val = 0
                break;

            case 's':
            case 'S':
                secs += val
                val = 0
                break;
        }
    })

    secs += val

    return secs
}