const log = require('../utils/logger')();
const userUtils = require('../utils/userUtils');
const onLeave = (botClient, guildMember) => {
    log.warn(`${userUtils.userLabel(guildMember)} is leaving guild!`)
    const auth = botClient.authTable();
    auth.revokeTokenForGuildMember(guildMember.guild.id, guildMember.id).catch(err => {
        log.error(err);
        log.fatal('Unable to revoke OTPs for user - EXITING!');
        process.exit(1);
    });
};

const onBan = (botClient, guild, user) => {
    log.warn(`${user.id} is being banned!`);
    const auth = botClient.authTable();
    auth.revokeTokenForGuildMember(guild.id, user.id).catch(err => {
        log.error(err);
        log.fatal('Unable to revoke OTPs for user - EXITING!');
        process.exit(1);
    });
};

module.exports = {
    onBan, onLeave
};