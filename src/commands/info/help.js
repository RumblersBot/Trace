const Discord = require("discord.js");
const { getPermissionName } = require("../../handlers/permissions")

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Returns all commands, or one specific command's info",
    usage: "[command | alias]",
    run: async (bot) => {
        let { client, message, args } = bot;

        let embed = null
        let prefix = await client.functions.get("functions").getPrefix(message.guild.id)

        if (args[0])
            embed = getCMD(client, message, args[0], prefix);
        else
            embed = getAll(client, message, prefix);

        if (!embed) return

        return message.channel.send({ embeds: [embed] })
    },
    getCMD,
    getAll
};
function getAll(client, message, prefix) {
    // let reacts = [
    //     ":tools:",
    //     ":information_source:"
    // ];
    let embedfields = [];
    client.categories.forEach(c => {
        if (c == "hidden") return;
        var cmds = client.commands
            .filter(cmd => cmd.category === c)
            .filter(cmd => !cmd.guilds || cmd.guilds.includes(message.guild.id))
            .map(cmd => `\`${cmd.name}\``)
            .join(", ")

        if (!!cmds) {
            embedfields.push([
                c,
                cmds,
            ]);
        }
    });
    // for (var i = 0; i < embedfields.length; i++) {
    //     embedfields[i][0] = `${reacts[i]} ${embedfields[i][0][0].toUpperCase() +
    //         embedfields[i][0].substring(1)}`;
    // }



    //FIX change image to bot pfp auto link
    var em = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor({
            name: "Bot Commands",
            iconURL: message.guild.iconURL({ dynamic: true })
        })

    embedfields.forEach(b => {
        em.addFields({ name: b[0], value: b[1], inline: true });
    });

    em.setFooter({
        text: `Use ${prefix}help <command> for more info on a specific command\n[Command count: ` +
            client.commands.size +
            "]"
    })

    return em
}
function getCMD(client, message, input, prefix) {
    const embed = new Discord.MessageEmbed();
    const cmd =
        client.commands.get(input.toLowerCase()) ||
        client.commands.get(client.aliases.get(input.toLowerCase()));
    let info = `No information found for command **${input.toLowerCase()}**`;
    if (!cmd)
        //no specified command
        return embed.setColor("RED").setDescription(info);

    if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.aliases)
        info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (!!cmd.permissions) info += `\n**Min. Permission**: ${getPermissionName(cmd.permissions)}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${prefix}${cmd.name} ${cmd.usage}`;
        embed.setFooter({ text: `Syntax: <> = required, [] = optional` });
    }
    return embed.setColor("GREEN").setDescription(info)
}
