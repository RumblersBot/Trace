const fs = require("fs")
module.exports = {
    name: "eval",
    category: "hidden",
    permissions: -1,
    description: "evaluates javascript code",
    usage: "<scriptblock>",
    run: async (bot) => {
        let { client, message, args } = bot

        var code = args.join(" ")
        code = code.replace(/(^\`{3}js(\n|\s)*)|((\n|\s)*\`{3}$)/g, ""); //allows the usage of the js code block in discord (```js...```)
        const result = new Promise((resolve, reject) => resolve(eval(code)));

        return result
            .then(async (output) => {
                if (typeof output !== "string") {
                    output = require("util").inspect(output, { depth: 1 });
                }

                output = replaceHiddenString(output)

                await message.reply(output.substring(0, 1900), { //cuts response message short of discord message limit of 2000 chars
                    code: "js",
                });
            })
            .catch(async (err) => {
                err = err.toString();
                err = replaceHiddenString(err)
                await message.reply(err, {
                    code: "js",
                });
            });
    }
}

function replaceHiddenString(sourceString) {
    let output = sourceString

    if (fs.existsSync(".env")) {
        let EnvKeys = fs.readFileSync('.env').toString().split('\n')
        EnvKeys.forEach((e, i) => {
            e = e.split('=')[0]
            output = output.replace(process.env[e], `ENV_${e}`)
        })
    }
    
    output = output.replace(process.env.DISCORD_TOKEN, "T0K3N"); //replaces the token 
    output = output.replace(process.env.MONGODB_PASS, "M0NG0DB_P4SS"); //replaces the password

    return output
}