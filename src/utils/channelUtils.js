const generateUniqueChannelName = (guild, channelPrefix) => {
    const maxChannel = guild.channels.cache.filter(channel => channel.name.startsWith(channelPrefix + '-'))
        .map(channel => parseInt(channel.name.split('-')[1], 10)).sort().pop() || 0;
    return `${channelPrefix}-${maxChannel + 1}`;           
}

const generateIsolatedChannel = (guild, channelName, guildMember, modRoles) => {
    const everyoneRole = guild.roles.everyone;          
    const modRoleOverrides = modRoles.map(role => ({
        type: 'role',
        id: role.id,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
    }));

    return guild.channels.create(channelName, {
        type: 'text',
        permissionOverwrites: [{
            type: 'role',
            deny: 'VIEW_CHANNEL',
            id: everyoneRole.id
        }, {
            type: 'member',
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
            id: guildMember.id
        }, ...modRoleOverrides]
    });
}

module.exports = {
    'generateUniqueChannelName': generateUniqueChannelName,
    'generateIsolatedChannel': generateIsolatedChannel
}