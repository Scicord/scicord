const userLabel = (guildMember) => {
    return `${guildMember.user.username}#${guildMember.user.discriminator}`;
}

module.exports = {
    userLabel
}