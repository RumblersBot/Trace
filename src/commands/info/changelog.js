const fs = require("fs")
const readLastLines = require('read-last-lines');

module.exports = {
    name: "changelog",
    category: "info",
    description: 'Shows the latest ChangeLogs',
    usage: "[Quantity]",
    run: async ({message, args}) => {
        const path = './changelog.md'
        if (fs.existsSync(path)) {
            let number = args[0]
            if (!number) number = 20

            let changelog = await readLastLines.read(path, number)
            await message.reply({
                content: `**Last __*${number}*__ changelog Lines:**\n\`\`\`` + changelog + " \`\`\`"
            })
        }
    }
}