async function resolveMember(message, argument, defaultToAuthor) {
    let foundMember = message.mentions.members.first()
    if (foundMember) return foundMember

    if (!!argument) {

        foundMember = message.guild.members.cache.find(entry => entry.user.username.toLowerCase() === argument.toLowerCase())
        if (!!foundMember) return foundMember

        foundMember = await message.guild.members.search({ query: argument, limit: 5 })
        if (foundMember.size !== 0) {
            foundMember = foundMember.filter(entry => entry.user.username.toLowerCase() === argument.toLowerCase())
            if (foundMember.size !== 0) return foundMember.first()
        }

        if (!isNaN(argument)) {

            foundMember = await message.guild.members.cache.get(argument)
            if (!!foundMember) return foundMember

            foundMember = await message.guild.members.fetch(argument)
            if (!!foundMember) return foundMember
        }
    }
    if (defaultToAuthor) return message.member
}

async function resolveChannel(message, argument, defaultToSourceChannel) {
    let foundChannel = message.mentions.channels.first()
    if (foundChannel) return foundChannel

    if (!!argument) {        
        
        foundChannel = message.guild.channels.cache.find(entry => entry.name.toLowerCase() === argument.toLowerCase())
        if (!!foundChannel) return foundChannel

        if (!isNaN(argument)) {

            foundChannel = await message.guild.channels.cache.get(argument)
            if (!!foundChannel) return foundChannel

            foundChannel = await message.guild.channels.fetch(argument)
            if (!!foundChannel) return foundChannel
        }
    }
    if (defaultToSourceChannel) return message.channel
}

async function resolveRole(message, argument) {
    let foundRole = message.mentions.roles.first()
    if (foundRole) return foundRole

    if (!!argument) {        

        foundRole = message.guild.roles.cache.find(entry => entry.name.toLowerCase() === argument.toLowerCase())
        if (!!foundRole) return foundRole

        if (!isNaN(argument)) {

            foundRole = await message.guild.roles.cache.get(argument)
            if (!!foundRole) return foundRole

            foundRole = await message.guild.roles.fetch(argument)
            if (!!foundRole) return foundRole
        }
    }
}

module.exports = {
    name: "parameters",
    resolveMember,
    resolveChannel,
    resolveRole
}