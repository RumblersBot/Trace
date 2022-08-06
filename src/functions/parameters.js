async function resolveMember(message, argument, defaultToAuthor) {
    let foundMember = message.mentions.members.first()
    if (foundMember) return foundMember

    if (!!argument) {

        foundMember = message.guild.members.cache.find(entry => entry.user.username === argument)
        if (!!foundMember) return foundMember

        foundMember = await message.guild.members.search({ query: argument })
        if (foundMember.size !== 0) return foundMember.first()

        foundMember = await message.guild.members.cache.get(argument)
        if (!!foundMember) return foundMember

        foundMember = await message.guild.members.fetch(argument)
        if (!!foundMember) return foundMember
    }
    if (defaultToAuthor) return message.member
}

module.exports = {
    name: "parameters",
    resolveMember
}