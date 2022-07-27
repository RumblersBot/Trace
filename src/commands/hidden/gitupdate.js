module.exports = {
    name: "gitupdate",
    category: "hidden",
    permissions: -1,
    description: 'Update bot from git latest',
    run: async ({ client, message, args }) => {
        var exec = require('child_process').exec;

        exec("git pull",
            function (error, stdout, stderr) {
                message.reply(
                    'stdout: ' + stdout + '\n' +
                    'stderr: ' + stderr + '\n'
                )
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            })
    }
}

