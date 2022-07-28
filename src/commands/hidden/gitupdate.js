const { addLog } = require('../../functions/logs');

module.exports = {
    name: "gitupdate",
    category: "hidden",
    permissions: -1,
    description: 'Update bot from git latest',
    run: async ({ client, message, args }) => {
        var exec = require('child_process').exec;

        exec("git pull",
            function (error, stdout, stderr) {
                let result = ""
                if (stdout)
                    result += 'stdout: ' + stdout + '\n'
                if (stderr)
                    result += 'stderr: ' + stderr + '\n'
                message.reply({
                    content: result,
                    flags: [Discord.MessageFlags.FLAGS.SUPPRESS_EMBEDS]
                })
                if (error !== null) {
                    addLog('exec error: ' + error);
                }
            })
    }
}

